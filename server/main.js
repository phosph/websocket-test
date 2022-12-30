import WebSocket, { WebSocketServer } from 'ws';
import express from 'express';
import session from 'express-session';
import { v4 as uuid } from 'uuid';

class GameSession {
  userA;
  userB;

  constructor(userA = null, userB = null) {
    this.userA = userA;
    this.userB = userB;
  }

  get canStart() {
    return !!(this.userA && this.userB);
  }

  addGamer(gamerId) {
    if (!this.userA) this.userA = gamerId;
    else if (!this.userB) this.userB = gamerId;
    else return false;

    return true;
  }

  hasGamer(gamerId) {
    return this.userA === gamerId || this.userB === gamerId;
  }
}

const map = new Map();
const games = new Set();

const findGame = (userId) => {
  for (const game of games) {
    if (game.hasGamer(userId)) {
      return game;
    }
  }

  return null;
};

const sessionParser = session({
  secret: '$eCuRiTy',
  resave: false,
  saveUninitialized: false,
});

const app = express();

app.use('/', express.static(new URL('../web', import.meta.url).pathname));
app.use(sessionParser);

const myServer = app.listen(9876);

const wss = new WebSocketServer({
  noServer: true,
});

wss.on('connection', (ws, request) => {
  const userId = request.session.userId;

  map.set(userId, ws);

  ws.on('message', (msg) => {
    for (const game of games.values()) {
      if (game.hasGamer(userId) && game.canStart) {
        if (userId === game.userA) {
          const client = map.get(game.userA);
          if (client.readyState === WebSocket.OPEN)
            client.send(`${userId}: ${msg.toString()}`);
        } else {
          const client = map.get(game.userB);
          if (client.readyState === WebSocket.OPEN)
            client.send(`${userId}: ${msg.toString()}`);
        }
        break;
      }
    }
  });

  ws.on('close', () => {
    map.delete(userId);
  });

  setTimeout(() => {
    const game = findGame(userId);
    console.log(game);
    if (game) {
      const payload = JSON.stringify({ status: game.canStart });
      console.log({ status: game.readyState }, payload);
      ws.send(payload);
    }
  });
});

app.post('/login', function (req, res) {
  const id = uuid();

  console.log(`Updating session for user ${id}`);

  req.session.userId = id;

  let currentGame = null;
  for (const game of games.values()) {
    if (!game.canStart && game.addGamer(id)) {
      currentGame = game;
      console.log('se encontró contrincante');
      const two = map.get(game.userA);
      if (two?.readyState === WebSocket.OPEN) {
        two.send(`${id} se conectó`);
      }

      break;
    }
  }

  currentGame ??= new GameSession(id);

  games.add(currentGame);

  res.send({ result: 'OK', message: 'Session updated', userId: id });
});

app.delete('/logout', function (request, response) {
  const id = request.session.userId;
  const ws = map.get(id);

  console.log('Destroying session');

  request.session.destroy(() => {
    if (ws) ws.close();

    for (const game of games.values()) {
      if (game.hasGamer(id)) {
        if (game.userA === id) {
          map.get(game.userB)?.send('se fué');
        } else {
          map.get(game.userA)?.send('se fué');
        }
      }
    }

    response.send({ result: 'OK', message: 'Session destroyed' });
  });
});

//handling upgrade(http to websocekt) event
myServer.on('upgrade', async (request, socket, head) => {
  const { pathname } = new URL(
    request.url ?? '/',
    `http://${request.headers.host}`
  );

  if (pathname === '/game') {
    sessionParser(request, {}, () => {
      if (!request.session.userId) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }

      console.log('Session is parsed!');

      wss.handleUpgrade(request, socket, head, (ws) =>
        wss.emit('connection', ws, request)
      );
    });
  } else {
    socket.destroy();
  }
});

// @ts-check
import * as dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import session from 'express-session'
import { WebSocketServer } from 'ws'

console.log('initializing DB')
import { sequelize } from './models/index.js'
await sequelize.sync({ alter: true })

import { GameList } from './controllers/game-controller.js'
import * as WSControlers from './controllers/websocket-message-controller.js'

/** @type {Map<string, import("ws").WebSocket>} */
const userWsMap = new Map()

const gameList = new GameList()

const sessionParser = session({
  secret: '$eCuRiTy',
  resave: false,
  saveUninitialized: true,
})

const app = express()

app.use(sessionParser)
app.use('/', express.static(new URL('./web', import.meta.url).pathname))
app.use('/utils', express.static(new URL('./utils', import.meta.url).pathname))

const server = app.listen(process.env.PORT)

const wss = new WebSocketServer({
  noServer: true,
})

server.on(
  'upgrade',
  async (/** @type {import("express").request} */ request, socket, head) => {
    const { pathname } = new URL(
      request.url ?? '/',
      `http://${request.headers.host}`,
    )

    if (pathname === '/game') {
      sessionParser(
        request,
        /** @type {import("express").response} */ ({}),
        () => {
          if (!request.session.id) {
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
            socket.destroy()
            return
          }

          wss.handleUpgrade(request, socket, head, (ws) =>
            wss.emit('connection', ws, request),
          )
        },
      )
    } else {
      socket.destroy()
    }
  },
)

wss.on('connection', (ws, /** @type {import("express").request} */ request) => {
  const userId = request.session.id
  userWsMap.set(userId, ws)

  ws.addEventListener('message', (event) =>
    WSControlers.messageController(event, gameList, userWsMap, userId),
  )
  ws.on('close', () => {
    userWsMap.delete(userId)
  })
})

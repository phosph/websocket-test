// @ts-check
import * as WSEventTypes from 'utils/event-types.js'
import { GameController } from './game-controller.js'

/**
 * @param {import("ws").MessageEvent} event
 * @param {import("./game-controller.js").GameList} gameList
 * @param {Map<string, import("ws").WebSocket>} websocketList
 * @param {string} userId
 */
export async function messageController(
  event,
  gameList,
  websocketList,
  userId,
) {
  try {
    const data = JSON.parse(event.data.toString())
    if (!WSEventTypes.isPayloadData(data)) return

    switch (data.type) {
      case WSEventTypes.START_GAME:
        await startGameController(gameList, websocketList, userId)
        break
      case WSEventTypes.SQUARE_SELECTED: {
        const game = gameList.getByUserId(userId)
        if (game) {
          const del = await squareSelectedController(
            game,
            websocketList,
            userId,
            /** @type {WSEventTypes.SquareSelectedPayload} */ (data),
          )
          if (del) gameList.remove(game)
        }
        break
      }
    }
  } catch (e) {
    console.error(e)
  }
}

/**
 * @param {import("./game-controller.js").GameList} gameList
 * @param {Map<string, import("ws").WebSocket>} websocketList
 * @param {string} userId
 * @returns {Promise<import("./game-controller.js").GameController>}
 */
async function startGameController(gameList, websocketList, userId) {
  const game =
    gameList.findEmptyGame() ??
    gameList.addGame(await new GameController().init())

  await game.addGamer(userId)

  if (game.canStart) {
    /** @type {import("utils/event-types.js").StartGameStatusPayload} */
    const wsPayload = {
      type: WSEventTypes.START_GAME_STATUS,
      data: { canStart: true },
    }

    const wsPayloadParsed = JSON.stringify(wsPayload)
    websocketList.get(/** @type {string} */ (game.userA))?.send(wsPayloadParsed)
    websocketList.get(/** @type {string} */ (game.userB))?.send(wsPayloadParsed)

    /** @type {WSEventTypes.UnlockUIPayload} */
    const unlockEvent = {
      type: WSEventTypes.UNLOCK_UI,
      data: null,
    }
    websocketList
      .get(/** @type {string} */ (game.userA))
      ?.send(JSON.stringify(unlockEvent))

    /** @type {WSEventTypes.LockUIPayload} */
    const lockEvent = {
      type: WSEventTypes.LOCK_UI,
      data: null,
    }
    websocketList
      .get(/** @type {string} */ (game.userB))
      ?.send(JSON.stringify(lockEvent))
  } else {
    /** @type {import("utils/event-types.js").StartGameStatusPayload} */
    const wsPayload = {
      type: WSEventTypes.START_GAME_STATUS,
      data: { canStart: false },
    }

    const parsed = JSON.stringify(wsPayload)
    websocketList.get(userId)?.send(parsed)
  }

  return game
}

/**
 * @param {GameController} game
 * @param {Map<string, import("ws").WebSocket>} websocketList
 * @param {string} userId
 * @param {WSEventTypes.SquareSelectedPayload} data
 * @returns {Promise<boolean>}
 */
async function squareSelectedController(game, websocketList, userId, data) {
  if (!game) throw new TypeError('invalid Game')
  const win = await game.selectSquare(userId, data.data.square)

  const userWs = websocketList.get(userId)
  if (!userWs) throw new Error('there is no WebSocket')

  /** @type {WSEventTypes.LockUIPayload} */
  const lockEvent = {
    type: WSEventTypes.LOCK_UI,
    data: null,
  }

  userWs?.send(JSON.stringify(lockEvent))

  const adversaryWS = websocketList.get(
    /** @type {string} */ (userId === game.userA ? game.userB : game.userA),
  )

  if (!adversaryWS) throw new Error('there is no WebSocket')
  adversaryWS.send(JSON.stringify(data))

  if (win) {
    adversaryWS.send(JSON.stringify(lockEvent))

    /** @type {WSEventTypes.EndOfGamePayload} */
    const winEvent = {
      type: WSEventTypes.END_OF_GAME,
      data: { win: true },
    }
    userWs.send(JSON.stringify(winEvent))

    /** @type {WSEventTypes.EndOfGamePayload} */
    const loseEvent = {
      type: WSEventTypes.END_OF_GAME,
      data: { win: false },
    }
    adversaryWS.send(JSON.stringify(loseEvent))

    return true
  } else {
    /** @type {WSEventTypes.UnlockUIPayload} */
    const unlockEvent = {
      type: WSEventTypes.UNLOCK_UI,
      data: null,
    }
    adversaryWS.send(JSON.stringify(unlockEvent))
  }
  return false
}

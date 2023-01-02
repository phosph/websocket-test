// @ts-check

import { initGame } from './board.js'
import { messageController } from './wsmessege-controller.js'
import * as WSEventTypes from '../utils/event-types.js'

/**
 * @param {HTMLElement} container
 */
export const main = (container) => {
  const gameWs = new WebSocket(`ws://${location.host}/game`)

  gameWs.addEventListener('message', (event) =>
    messageController(event, container),
  )

  // gameWs.addEventListener('error', (event) => {
  //   console.log(event)
  // })
  // gameWs.addEventListener('open', (event) => {
  //   console.log(event)
  // })
  // gameWs.addEventListener('close', (event) => {
  //   console.log(event)
  // })

  return gameWs
}

/**
 * @param {HTMLElement} container
 * @param {WebSocket} ws
 */

export const startGame = (container, ws) => {
  /** @type {WSEventTypes.StartGamePayload} */
  const wsPayload = { type: WSEventTypes.START_GAME, data: null }
  ws.send(JSON.stringify(wsPayload))

  const evntTrg = initGame(container)

  evntTrg.addEventListener('SquareSelected', (event) => {
    const {
      detail: { square },
    } = /** @type {CustomEvent} */ (event)

    /** @type {WSEventTypes.SquareSelectedPayload} */
    const wsPayload = {
      type: WSEventTypes.SQUARE_SELECTED,
      data: { square },
    }

    ws.send(JSON.stringify(wsPayload))
  })
}

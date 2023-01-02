// @ts-check
import * as WSEventTypes from '../utils/event-types.js'
import { BoardElement } from './board.js'

const endOfGameModal = /** @type {HTMLElement} */ (
  document.getElementById('end-of-game')
)
const adversaryTurnModal = /** @type {HTMLElement} */ (
  document.getElementById('adversary-turn')
)
const waitForAdversaryModal = /** @type {HTMLElement} */ (
  document.getElementById('wait-for-adversary')
)

/**
 *
 * @param {WebSocketEventMap['message']} event
 * @param {HTMLElement} container
 * @returns
 */
export const messageController = (event, container) => {
  try {
    const payload = JSON.parse(event.data)

    if (!WSEventTypes.isPayloadData(payload)) return

    console.debug(payload)

    if (WSEventTypes.isStartGameStatus(payload)) {
      const { data } = payload

      if (data.canStart) {
        container.classList.toggle('enable', true)
        waitForAdversaryModal.classList.remove('open')
      } else {
        waitForAdversaryModal.classList.add('open')
      }
    } else if (WSEventTypes.isLockUI(payload)) {
      container.classList.toggle('enable', false)
      /** @type {BoardElement | null} */
      const board = container.querySelector('stacker-board')
      if (board) board.turn = BoardElement.ADVERSARY_TURN
      adversaryTurnModal.classList.add('open')
    } else if (WSEventTypes.isUnlockUI(payload)) {
      container.classList.toggle('enable', true)
      /** @type {BoardElement | null} */
      const board = container.querySelector('stacker-board')
      if (board) board.turn = BoardElement.SELF_TURN
      adversaryTurnModal.classList.remove('open')
    } else if (WSEventTypes.isSquareSelected(payload)) {
      /** @type {BoardElement | null} */
      const board = container.querySelector('stacker-board')
      board?.selectSquare(payload.data.square, true)
    } else if (WSEventTypes.isEndOfGame(payload)) {
      adversaryTurnModal.classList.remove('open')
      const message = endOfGameModal.querySelector('.message')
      if (message)
        message.textContent = payload.data.win ? 'You Win' : 'You Lose'
      endOfGameModal.classList.add('open')
    }
  } catch (e) {
    console.error(e)
  }
}

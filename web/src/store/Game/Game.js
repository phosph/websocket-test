// @ts-check
import { makeAutoObservable } from 'mobx'
import * as WSEventTypes from 'utils/event-types.js'

export class Game {
  static SELF_SQAURE = 1
  static ADVERSARY_SQAURE = 2
  static NONE_SQAURE = 0

  game = Array.from({ length: 49 }, () => Game.NONE_SQAURE)

  _started = false
  get started() {
    return this._started
  }
  _lockUi = true
  get lockUi() {
    return this._lockUi
  }
  _endOfGame = false
  get endOfGame() {
    return this._endOfGame
  }

  /** @type {null | boolean} */
  win = null

  constructor() {
    makeAutoObservable(this)
  }

  /**
   * @param {number} index
   * @param {Game.SELF_SQAURE | Game.ADVERSARY_SQAURE} who
   * @private
   */
  _selectSquare(index, who = Game.SELF_SQAURE) {
    this.game[index] = who
  }

  /**
   * @param {number} index
   */
  selectSquare(index) {
    if (!this._ws) throw new Error('is not connected')
    if (!this.started) throw new Error('the game is not ready for start')
    if (this.endOfGame) throw new Error('the game is finished')

    if (index < 0 || index > 48)
      throw new RangeError('index must be greater than 0 and les than 49')

    if (this.game[index] !== Game.NONE_SQAURE)
      throw new Error('the square is taken')

    const wsPayload = {
      type: WSEventTypes.SQUARE_SELECTED,
      data: { square: index },
    }

    this._ws.send(JSON.stringify(wsPayload))

    this._selectSquare(index)
  }

  /** @private */
  _connected = false

  get connected() {
    return this._connected
  }

  /**
   * @type {WebSocket | null}
   * @private
   * */
  _ws = null

  connectToServer() {
    if (this.connected) throw new Error('there is a connection')

    if (this._ws) return

    const gameWs = (this._ws = new WebSocket(
      `ws://localhost:9876/game`,
      // `ws://${globalThis.location.host}/game`,
    ))

    gameWs.addEventListener('error', (event) => {
      this._connected &&= false
      this._ws = null
      console.log(event)
    })
    gameWs.addEventListener('open', (event) => {
      this._connected = true
      console.log(event)

      /** @type {WSEventTypes.StartGamePayload} */
      const wsPayload = { type: WSEventTypes.START_GAME, data: null }
      gameWs.send(JSON.stringify(wsPayload))
    })
    gameWs.addEventListener('close', (event) => {
      this._connected = false
      this._ws = null
      console.log(event)
    })

    gameWs.addEventListener('message', (event) => {
      console.log(event)
      this._messageController(event)
    })
  }

  /**
   * @param {MessageEvent<string>} event
   * @private
   */
  _messageController(event) {
    try {
      const payload = JSON.parse(event.data)

      if (!WSEventTypes.isPayloadData(payload)) return

      console.debug(payload)

      if (WSEventTypes.isStartGameStatus(payload)) {
        const { data } = payload
        this._started = data.canStart
      } else if (this.game) {
        if (WSEventTypes.isLockUI(payload)) {
          this._lockUi = true
        } else if (WSEventTypes.isUnlockUI(payload)) {
          this._lockUi = false
        } else if (WSEventTypes.isSquareSelected(payload)) {
          this._selectSquare(payload.data.square, Game.ADVERSARY_SQAURE)
        } else if (WSEventTypes.isEndOfGame(payload)) {
          this._endOfGame = true
          this.win = payload.data.win
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  cleanUp() {
    this._ws?.close()
  }
}

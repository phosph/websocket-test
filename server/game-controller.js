// @ts-check
import { UserAddedEvent } from './game-controller-events.js'

/**
 * @emits UserAdded
 */
export class GameController extends EventTarget {
  static USER_A_SQAURE = 1
  static USER_B_SQAURE = 2
  static NONE_SQAURE = 0

  /**
   * @readonly
   * @type {number[]}
   */
  game = Array.from({ length: 49 }, () => GameController.NONE_SQAURE)

  /** @type {string | null} */
  #userA = null

  get userA() {
    return this.#userA
  }

  // /** @type {import("ws").WebSocket | null} */
  // #userAWS = null
  // get userAWS() {
  //   return this.#userAWS
  // }

  /** @type {string | null} */
  #userB = null
  get userB() {
    return this.#userB
  }

  // /** @type {import("ws").WebSocket | null} */
  // #userBWS = null
  // get userBWS() {
  //   return this.#userBWS
  // }

  /**
   * if the game can start
   * @type {boolean}
   */
  get canStart() {
    return !!(this.userA && this.userB)
  }

  /**
   * @param {Object} GamerControllerData
   * @param {string | null} [GamerControllerData.userA=null]
   * @param {string | null} [GamerControllerData.userB=null]
   */
  constructor({ userA = null, userB = null } = {}) {
    super()
    this.#userA = userA
    this.#userB = userB
  }

  /**
   * Add a new gamer
   * @param {string} gamerId
   * @returns {boolean} true if the gamer was addet, false otherwise
   */
  addGamer(gamerId) {
    if (!gamerId) throw TypeError('gamerId must be a string')

    if (!this.userA) {
      this.#userA = gamerId
    } else if (!this.userB) {
      this.#userB = gamerId
    } else return false

    this.dispatchEvent(new UserAddedEvent({ cancelable: false }))

    return true
  }

  /**
   * @param {string} gamerId
   * @returns {boolean}
   */
  hasGamer(gamerId) {
    return this.userA === gamerId || this.userB === gamerId
  }

  /**
   *
   * @param {string} who
   * @param {number} index
   */
  selectSquare(who, index) {
    const _who =
      who === this.userA
        ? GameController.USER_A_SQAURE
        : GameController.USER_B_SQAURE

    if (index < 0 || index > 48)
      throw new RangeError('index must be greater than 0 and les than 49')

    this.game[index] = _who

    const rowNumber = (index / 7) | 0
    const columnNumber = index % 7
    let celdCount = 0

    for (let column = rowNumber * 7; column < rowNumber * 7 + 7; column++) {
      if (this.game[column] === _who) {
        celdCount++
        if (celdCount === 4) break
      } else celdCount &&= 0
    }

    if (celdCount === 4) {
      console.log('gano por fila')
      return true
    }

    celdCount = 0
    for (let row = 0; row < 7; row++) {
      if (this.game[row * 7 + columnNumber] === _who) {
        celdCount++
        if (celdCount >= 4) break
      } else celdCount &&= 0
    }

    if (celdCount === 4) {
      console.log('gano por columna')
      return true
    }

    return false
  }
}

export class GameList {
  /** @type {Map<string, GameController>} */
  #gameByUser = new Map()

  /** @type {Set<GameController>} */
  #gameList = new Set()

  /**
   *
   * @param {GameController} game
   */
  addGame(game) {
    this.#gameList.add(game)

    if (game.userA) {
      this.#gameByUser.set(game.userA, game)
    }
    if (game.userB) {
      this.#gameByUser.set(game.userB, game)
    }

    if (!game.canStart) {
      game.addEventListener('UserAdded', () => {
        if (game.userA && !this.#gameByUser.has(game.userA)) {
          this.#gameByUser.set(game.userA, game)
        }
        if (game.userB && !this.#gameByUser.has(game.userB)) {
          this.#gameByUser.set(game.userB, game)
        }
      })
    }

    return game
  }

  /**
   * @param {GameController} game
   */
  remove(game) {
    if (game.userA) this.#gameByUser.delete(game.userA)
    if (game.userB) this.#gameByUser.delete(game.userB)
    this.#gameList.delete(game)
  }

  findEmptyGame() {
    for (const game of this.#gameList) {
      if (!game.canStart) return game
    }

    return null
  }

  /** @param {string} userId */
  getByUserId(userId) {
    return this.#gameByUser.get(userId)
  }
}

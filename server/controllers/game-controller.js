// @ts-check
import { Game } from '../models/index.js'
import { UserAddedEvent } from './game-controller-events.js'

/**
 * @emits UserAdded
 */
export class GameController extends EventTarget {
  /**
   * @readonly
   * @type {Game & import('../models/game.model.js').GameModel}
   */
  game$

  get userA() {
    return this.game$.userAId
  }

  get userB() {
    return this.game$.userBId
  }

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

    this.game$ =
      /** @type {Game & import('../models/game.model.js').GameModel} */ (
        Game.build({
          userAId: userA,
          userBId: userB,
        })
      )
  }

  async init() {
    await this.game$.save()
    return this
  }

  /**
   * Add a new gamer
   * @param {string} gamerId
   * @returns {Promise<boolean>} true if the gamer was addet, false otherwise
   */
  async addGamer(gamerId) {
    const added = this.game$.addGamer(gamerId)

    if (added) await this.game$.save()

    this.dispatchEvent(new UserAddedEvent({ cancelable: false }))

    return added
  }

  /**
   *
   * @param {string} who
   * @param {number} index
   * @return {Promise<Boolean>} if the game ends
   */
  async selectSquare(who, index) {
    const _who = who === this.userA ? Game.USER_A_SQAURE : Game.USER_B_SQAURE

    const board = this.game$.selectSquare(_who, index)

    await this.game$.save()

    const rowNumber = (index / 7) | 0
    const columnNumber = index % 7
    let celdCount = 0

    for (let column = rowNumber * 7; column < rowNumber * 7 + 7; column++) {
      if (board[column] === _who) {
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
      if (board[row * 7 + columnNumber] === _who) {
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

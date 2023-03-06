// @ts-check
import { makeAutoObservable } from 'mobx'
import Game from '../Game'

export class Store {
  /**
   * @type {Game | null}
   * @private
   */
  _game = null

  get game() {
    return this._game
  }

  constructor() {
    makeAutoObservable(this)
  }

  startGame() {
    this._game?.cleanUp()
    this._game = new Game()

    this._game.connectToServer()
  }
}

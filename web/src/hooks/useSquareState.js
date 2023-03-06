import { computed, makeObservable } from 'mobx'
import { useStore } from '../store'
import Game from '../store/Game'
import { useMobxComputedValue } from './useMobxComputedValue'

class SquareState {
  /** @readonly */
  index

  /**
   * @type {Game}
   * @readonly */
  _game

  get state() {
    return this._game.game[this.index]
  }

  get selected() {
    return this.state !== Game.NONE_SQAURE
  }

  get adversary() {
    return this.state === Game.ADVERSARY_SQAURE
  }

  get inactive() {
    if (this._game.lockUi) return true

    const column = this.index % 7

    if (this.state === Game.NONE_SQAURE) {
      if (column === 0 || column === 6) return false
      if (
        this._game.game[this.index - 1] !== Game.NONE_SQAURE ||
        this._game.game[this.index + 1] !== Game.NONE_SQAURE
      )
        return false
    }

    return true
  }

  constructor(index, game) {
    Object.defineProperties(this, {
      index: {
        value: index,
        enumerable: true,
        writable: false,
        configurable: false,
      },
      _game: {
        value: game,
        enumerable: false,
        writable: false,
        configurable: false,
      },
      selectSquare: {
        value: this.selectSquare.bind(this),
        enumerable: false,
        writable: false,
        configurable: false,
      },
    })

    makeObservable(this, {
      inactive: computed,
      state: computed,
      adversary: computed,
      selected: computed,
    })
  }

  selectSquare() {
    if (!this.inactive) {
      this._game.selectSquare(this.index)
    }
  }
}

/**
 *
 * @param {number} index
 * @returns {SquareState | null}
 */
export const useSquareState = (index) => {
  const store = useStore()

  const squareState = useMobxComputedValue(() => {
    if (typeof index !== 'number') return null
    if (!store.game) return null
    return new SquareState(index, store.game)
  })

  return squareState
}

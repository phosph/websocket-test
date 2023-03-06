import { DataTypes, Model } from 'sequelize'

/**
 * @typedef {Object} GameModel
 * @property {number} id
 * @property {string} userAId
 * @property {string} userBId
 * @property {readonly number[]} boardState
 */

/**
 * @implements {GameModel}
 */
export class Game extends Model {
  /** @readonly */
  static USER_A_SQAURE = 1
  /** @readonly */
  static USER_B_SQAURE = 2
  /** @readonly */
  static NONE_SQAURE = 0

  addGamer(gamerId) {
    if (!gamerId) throw TypeError('gamerId must be a string')

    if (!this.userAId) {
      this.userAId = gamerId
    } else if (!this.userBId) {
      this.userBId = gamerId
    } else return false

    return true
  }

  /**
   *
   * @param {Game.USER_A_SQAURE | Game.USER_B_SQAURE | Game.NONE_SQAURE} who
   * @param {number} squareIndex
   * @return {readonly number[]}
   */
  selectSquare(who, index) {
    if (index < 0 || index > 48)
      throw new RangeError('index must be greater than 0 and les than 49')

    const board = [...this.boardState]
    board[index] = who
    this.boardState = board
    return board
  }

  static declareModel(sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        boardState: {
          type: DataTypes.JSON,
          defaultValue: Array.from({ length: 49 }, () => 0),
          // defaultValue: JSON.stringify(Array.from({ length: 49 }, () => 0)),
        },
        userAId: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        userBId: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      { sequelize, modelName: 'Game' },
    )
  }
}

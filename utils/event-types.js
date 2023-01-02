// @ts-check

/**
 * @template {string} [T=string]
 * @template [D=unknown]
 * @typedef {{ type: T, data: D }} PayloadData
 */

/**
 * @param {any} data
 * @return {data is PayloadData} */
export const isPayloadData = (data) =>
  typeof data === 'object' && data !== null && 'type' in data

export const START_GAME_STATUS = 'startGameStatus'
/**
 * @typedef {PayloadData<START_GAME_STATUS, {canStart: boolean}>} StartGameStatusPayload
 *
 * @param {PayloadData} obj
 * @returns {obj is StartGameStatusPayload}
 */
export const isStartGameStatus = (obj) => obj.type === START_GAME_STATUS

export const START_GAME = 'startGame'
/**
 * @typedef {PayloadData<START_GAME>} StartGamePayload
 *
 * @param {PayloadData} obj
 * @returns {obj is StartGamePayload}
 */
export const isStartGame = (obj) => obj.type === START_GAME

export const SQUARE_SELECTED = 'squareSelected'
/**
 * @typedef {PayloadData<SQUARE_SELECTED, { square: number }>} SquareSelectedPayload
 *
 * @param {PayloadData} obj
 * @returns {obj is SquareSelectedPayload}
 */
export const isSquareSelected = (obj) => obj.type === SQUARE_SELECTED

export const LOCK_UI = 'lockUi'
/**
 * @typedef {PayloadData<LOCK_UI>} LockUIPayload
 *
 * @param {PayloadData} obj
 * @returns {obj is LockUIPayload}
 */
export const isLockUI = (obj) => obj.type === LOCK_UI

export const UNLOCK_UI = 'unlockUi'
/**
 * @typedef {PayloadData<UNLOCK_UI>} UnlockUIPayload
 *
 * @param {PayloadData} obj
 * @returns {obj is UnlockUIPayload}
 */
export const isUnlockUI = (obj) => obj.type === UNLOCK_UI


export const END_OF_GAME = 'endOfGame'
/**
 * @typedef {PayloadData<END_OF_GAME, { win: boolean }>} EndOfGamePayload
 *
 * @param {PayloadData} obj
 * @returns {obj is EndOfGamePayload}
 */
export const isEndOfGame = (obj) => obj.type === END_OF_GAME
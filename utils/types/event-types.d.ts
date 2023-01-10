export function isPayloadData(data: any): data is PayloadData<string, unknown>;
export const START_GAME_STATUS: "startGameStatus";
export function isStartGameStatus(obj: PayloadData): obj is StartGameStatusPayload;
export const START_GAME: "startGame";
export function isStartGame(obj: PayloadData): obj is StartGamePayload;
export const SQUARE_SELECTED: "squareSelected";
export function isSquareSelected(obj: PayloadData): obj is SquareSelectedPayload;
export const LOCK_UI: "lockUi";
export function isLockUI(obj: PayloadData): obj is LockUIPayload;
export const UNLOCK_UI: "unlockUi";
export function isUnlockUI(obj: PayloadData): obj is UnlockUIPayload;
export const END_OF_GAME: "endOfGame";
export function isEndOfGame(obj: PayloadData): obj is EndOfGamePayload;
export type PayloadData<T extends string = string, D = unknown> = {
    type: T;
    data: D;
};
export type StartGameStatusPayload = PayloadData<"startGameStatus", {
    canStart: boolean;
}>;
export type StartGamePayload = PayloadData<"startGame">;
export type SquareSelectedPayload = PayloadData<"squareSelected", {
    square: number;
}>;
export type LockUIPayload = PayloadData<"lockUi">;
export type UnlockUIPayload = PayloadData<"unlockUi">;
export type EndOfGamePayload = PayloadData<"endOfGame", {
    win: boolean;
}>;

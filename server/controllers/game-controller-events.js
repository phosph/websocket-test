// @ts-check

export class UserAddedEvent extends Event {
  /**
   * @param {EventInit=} eventInitDict
   */
  constructor(eventInitDict) {
    super('UserAdded', eventInitDict)
  }
}

export class StartGameEvent extends Event {
  /**
   * @param {EventInit=} eventInitDict
   */
  constructor(eventInitDict) {
    super('StartGame', eventInitDict)
  }
}

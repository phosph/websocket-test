// @ts-check

/**
 * @param {TemplateStringsArray} strings
 * @param  {...any} values
 * @returns {string}
 */
const html = (strings, ...values) =>
  String.raw(
    { raw: strings },
    ...values
      .filter((s) => s !== undefined && s !== null && typeof s !== 'boolean')
      .map((v) => (Array.isArray(v) ? v.join(' ') : v)),
  )

const boardTemplate = document.createElement('template')

boardTemplate.innerHTML = html`
  <section class="turn-indicator">
    <p class="your-turn-indicator">your turn</p>
    <p class="adversary-turn-indicator">adversary turn</p>
  </section>
  <section class="board">
    ${Array.from({ length: 49 }).map(
      (_, i) => html`
        <div
          data-i="${i}"
          class="board-square ${i % 7 && i % 7 < 6 && 'inactive'}"
        ></div>
      `,
    )}
  </section>
`

/**
 *
 * @param {number} squareIndex
 * @param {HTMLElement} container
 * @param {boolean=} adversary
 */
const selectSquare = (squareIndex, container, adversary = false) => {
  /** @type {HTMLElement | null} */
  const boardEl = container.querySelector('.board')

  if (!boardEl) throw new Error('game is not init')

  const square = findSquareByIndex(squareIndex, boardEl)

  square.classList.toggle('inactive', false)
  square.classList.toggle('selected', true)
  if (adversary) square.classList.toggle('adversary', true)

  const squareMatrix = Array.from(boardEl.children)

  if (squareIndex % 7) {
    if (
      squareIndex % 7 === 6 ||
      squareMatrix[squareIndex - 1].classList.contains('inactive')
    ) {
      squareMatrix[squareIndex - 1]?.classList.toggle('inactive', false)
    } else {
      squareMatrix[squareIndex + 1]?.classList.toggle('inactive', false)
    }
  } else {
    squareMatrix[squareIndex + 1]?.classList.toggle('inactive', false)
  }
}

/**
 * @param {number} index
 * @param {HTMLElement} container
 */
const findSquareByIndex = (index, container) => {
  if (index < 0 || index > 48)
    throw new RangeError('index must be greater than 0 and les than 49')

  const square = container.querySelector(
    `.board-square:nth-child(${index + 1})`,
  )

  if (!square) throw new Error('game is not initialiced')

  return square
}

/**
 *
 * @param {HTMLElement} container
 * @returns {EventTarget}
 */
export const initGame = (container) => {
  const boardEl = document.createElement('stacker-board')
  container.appendChild(boardEl)

  return boardEl
}

export const renderBoard = (container = document.body) => {
  const content = /** @type {DocumentFragment} */ (
    boardTemplate.content.cloneNode(true)
  )

  const boardEl = /** @type {HTMLSelectElement} */ (
    content.querySelector('.board')
  )

  container.appendChild(content)

  return boardEl
}

export class BoardElement extends HTMLElement {
  static ADVERSARY_TURN = 'adversary'
  static SELF_TURN = 'self'

  constructor() {
    super()

    this.attachInternals()
  }

  /** @type {HTMLElement | null} */
  #turnIndicator = null

  /** @type {BoardElement.ADVERSARY_TURN | BoardElement.SELF_TURN} */
  #turn = BoardElement.SELF_TURN
  /** @param {BoardElement.ADVERSARY_TURN | BoardElement.SELF_TURN} val */
  set turn(val) {
    this.#turn = val
    if (this.#turnIndicator) {
      this.#turnIndicator.dataset.turn = val
    }
  }
  get turn() {
    return this.#turn
  }

  connectedCallback() {
    const boardEl = renderBoard(this)

    boardEl.addEventListener('click', (event) => {
      /** @type {HTMLElement | null} */
      let square
      if (
        event.target instanceof HTMLElement &&
        (square = event.target.closest('.board-square')) &&
        !square.classList.contains('inactive') &&
        !square.classList.contains('selected')
      ) {
        const squareIndex = Number(square.dataset.i)

        this.dispatchEvent(
          new CustomEvent('SquareSelected', {
            detail: {
              square: squareIndex,
            },
          }),
        )

        selectSquare(squareIndex, this, false)
      }
    })

    this.#turnIndicator = this.querySelector('.turn-indicator')

    new MutationObserver((entries) => {
      for (const entry of entries) {
        if (entry.type === 'attributes') {
          switch (entry.attributeName) {
            case 'turn': {
              this.turn =
                this.getAttribute(entry.attributeName) ?? BoardElement.SELF_TURN
            }
          }
        }
      }
    }).observe(this, {
      attributes: true,
      attributeFilter: ['turn'],
    })

    this.turn = this.getAttribute('turn') ?? BoardElement.SELF_TURN
  }

  /**
   * @param {number} squareIndex
   * @param {boolean=} adversary
   */
  selectSquare(squareIndex, adversary) {
    return selectSquare(squareIndex, this, adversary)
  }

  static {
    customElements.define('stacker-board', this)
  }
}

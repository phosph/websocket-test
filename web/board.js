// @ts-check

const boardTemplate = document.createElement('template');

/**
 *
 * @param {TemplateStringsArray} strings
 * @param  {...any} values
 * @returns {string}
 */
const html = (strings, ...values) =>
  String.raw(
    { raw: strings },
    ...values
      .filter((s) => s !== undefined && s !== null && typeof s !== 'boolean')
      .map((v) => (Array.isArray(v) ? v.join(' ') : v))
  );

boardTemplate.innerHTML = html`
  <section class="board">
    ${Array.from({ length: 49 }).map(
      (_, i) => html`
        <div
          data-i="${i}"
          class="board-square ${i % 7 && i % 7 < 6 && 'inactive'}"
        ></div>
      `
    )}
  </section>
`;

export const renderBoard = (container = document.body) => {
  const content = /** @type {DocumentFragment} */ (
    boardTemplate.content.cloneNode(true)
  );

  const boardEl = /** @type {HTMLSelectElement} */ (
    content.querySelector('.board')
  );

  container.appendChild(content);

  return boardEl;
};

// @ts-check

import { renderBoard } from './board.js';

// let ws = null
const container = document.getElementById('board-container');
const loginBtn = /** @type {HTMLButtonElement} */ (
  document.getElementById('login')
);
const logoutBtn = /** @type {HTMLButtonElement} */ (
  document.getElementById('logout')
);

logoutBtn.disabled = true;

logoutBtn.addEventListener('click', async () => {
  logoutBtn.disabled = true;
  const response = await fetch('/logout', { method: 'DELETE' });
  loginBtn.disabled = false;
  if (container) container.innerHTML = '';
});

loginBtn.addEventListener('click', async () => {
  loginBtn.disabled = true;

  const response = await fetch('/login', { method: 'POST' });

  logoutBtn.disabled = false;

  initGame();

  //Websocekt variables
  const gameWs = new WebSocket(`ws://${location.host}/game`);

  gameWs.addEventListener('message', (event) => {
    try {
      const response = JSON.parse(event.data);
      console.log(response);
      if (typeof response === 'object' && response !== null) {
        if ('status' in response) {
          console.log('status', response.status);
          container?.classList.toggle('enable', response.status);
        }
      }
    } catch (e) {
      console.error(e);
    }
  });
  gameWs.addEventListener('error', (event) => {
    console.log(event);
  });
  gameWs.addEventListener('open', (event) => {
    console.log(event);
  });
  gameWs.addEventListener('close', (event) => {
    console.log(event);
  });

  //Creating DOM element to show received messages on browser page
  // const msgGeneration = (msg, from) => {
  //   const newMessage = document.createElement('h5');
  //   newMessage.innerText = `${from} says: ${msg}`;
  //   myMessages?.appendChild(newMessage);
  // };

  //enabling send message when connection is open
  // mywsServer.onopen = () => (sendBtn.disabled = false);
  //handling message event
  // mywsServer.onmessage = ({ data }) => msgGeneration(data, 'Server');

  //DOM Elements
  //   const myMessages = document.getElementById('messages');
  //   const myInput = /** @type {HTMLInputElement} */ (
  //     document.getElementById('message')
  //   );

  //   const sendBtn = /** @type {HTMLButtonElement} */ (
  //     document.getElementById('send-form')
  //   );

  //   sendBtn.disabled = true;
  //   sendBtn.addEventListener(
  //     'submit',
  //     (e) => {
  //       e.preventDefault();
  //       const text = myInput.value;
  //       mywsServer.send(text);

  //       myInput.value = '';
  //     },
  //     false
  //   );
});

const initGame = () => {
  if (container) {
    const boardEl = renderBoard(container);

    const squareMatrix = Array.from(boardEl.children);

    boardEl.addEventListener('click', (event) => {
      console.log(event);

      /** @type {HTMLElement | null} */
      let square;
      if (
        event.target instanceof HTMLElement &&
        (square = event.target.closest('.board-square')) &&
        !square.classList.contains('inactive') &&
        !square.classList.contains('selected')
      ) {
        square.classList.toggle('selected', true);
        const squareIndex = Number(square.dataset.i);

        if (squareIndex % 7) {
          if (
            squareIndex % 7 === 6 ||
            squareMatrix[squareIndex - 1].classList.contains('inactive')
          ) {
            squareMatrix[squareIndex - 1]?.classList.toggle('inactive', false);
          } else {
            squareMatrix[squareIndex + 1]?.classList.toggle('inactive', false);
          }
        } else {
          squareMatrix[squareIndex + 1]?.classList.toggle('inactive', false);
        }
      }
    });
  }
};

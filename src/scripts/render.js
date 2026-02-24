import { playGame } from './app.js';

export const render = (() => {
  const renderBoard = (player) => {
    const playerBoard = document.querySelector('.player-board');
    const computerBoard = document.querySelector('.computer-board');
    const boardArray = player.game.getGameboard();
    if (player.isPlayer) {
      boardArray.forEach((value) => {
        const isShip = value;
        const square = createElement(
          'div',
          'square',
          isShip ? `Ship${isShip.length}` : '',
        );
        playerBoard.appendChild(square);
      });
    } else {
      boardArray.forEach(() => {
        const square = createElement('div', 'square');
        computerBoard.appendChild(square);
      });
    }
  };

  const renderGame = (player, computer) => {
    const root = document.getElementById('root');
    if (root.classList.contains('form--active'))
      root.classList.remove('form--active');
    root.textContent = '';

    const header = createElement('header', 'header');
    const headerTitle = createElement('h1', 'header-title', 'Odin Battleship');
    header.appendChild(headerTitle);

    const main = createElement('main', 'main');
    const playerBoardContainer = createElement('div', 'board-container');
    const playerNameSpan = createElement(
      'span',
      'player-name',
      player.playerName,
    );
    const playerBoard = createElement('div', 'player-board');
    playerBoardContainer.append(playerNameSpan, playerBoard);

    const computerBoardContainer = createElement('div', 'board-container');
    const computerNameSpan = createElement(
      'span',
      'player-name',
      computer.playerName,
    );

    const centerContainer = createElement('div', 'center-container');
    const msgElement = createElement(
      'span',
      'msg-element',
      `Welcome Commander ${player.playerName}`,
    );
    const playButton = createElement(
      'button',
      'play-btn --btn-active',
      'Start',
    );
    const computerBoard = createElement('div', 'computer-board');
    computerBoardContainer.append(computerNameSpan, computerBoard);

    centerContainer.append(msgElement, playButton);
    main.append(playerBoardContainer, centerContainer, computerBoardContainer);
    root.append(header, main);
    renderBoard(player);
    renderBoard(computer);
  };

  const renderForm = () => {
    const root = document.getElementById('root');
    root.classList.add('form--active');
    root.textContent = '';

    const form = createElement('form', 'form');
    form.onsubmit = (e) => {
      e.preventDefault();
      const playerName = nameInput.value;
      playGame.createPlayers(playerName);
      const [player, computer] = playGame.getPlayers();
      renderGame(player, computer);
    };
    const inputFieldset = createElement('fieldset', 'input-fieldset');

    const nameLabel = createElement('label', 'name-label', 'Enter Your Name: ');
    nameLabel.htmlFor = 'name';

    const nameInput = createElement('input');
    nameInput.id = 'name';
    nameInput.autocomplete = 'off';
    nameInput.required = true;

    const submitButton = createElement('button', 'submit-btn', 'Confirm');

    inputFieldset.append(nameLabel, nameInput);
    form.append(inputFieldset, submitButton);
    root.appendChild(form);
  };

  return { renderBoard, renderForm, renderGame };
})();

function createElement(type, className, textContent) {
  const element = document.createElement(type);
  if (className) element.className = className;
  if (textContent) element.textContent = textContent;
  return element;
}

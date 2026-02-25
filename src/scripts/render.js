import { playGame } from './app.js';
import { playSong } from './audio.js';
import { events } from './events.js';

export const render = (() => {
  const renderBoard = (player) => {
    const playerBoard = document.querySelector('.player-board');
    const computerBoard = document.querySelector('.computer-board');
    const boardArray = player.game.getGameboard();
    if (player.isPlayer) {
      playerBoard.textContent = '';
      boardArray.forEach((value, index) => {
        const isShip = value;
        const square = createElement(
          'div',
          'square',
          isShip ? isShip.length : '',
        );
        if (isShip) {
          square.style.backgroundImage = `url('icons/ship${isShip.length}.svg')`;
          square.style.backgroundSize = 'contain';
          square.style.backgroundPosition = 'center';
          square.style.backgroundRepeat = 'no-repeat';
        }
        square.addEventListener('click', () => {
          events.moveShipEvent(player, isShip, index);
        });
        square.addEventListener('mouseenter', () =>
          events.shipHoverEvent(player, index),
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
      playSong();
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

  const renderSelectShip = (ship) => {
    const selectedSquares = document.querySelectorAll('.--selected');
    if (selectedSquares)
      selectedSquares.forEach((square) =>
        square.classList.remove('--selected'),
      );
    const boardDivs = document.querySelectorAll('.player-board .square');
    if (ship)
      ship.coordinates.forEach((coor) =>
        boardDivs[coor].classList.add('--selected'),
      );
  };

  const renderHover = (isValid, newCoor) => {
    const validSquares = document.querySelectorAll('.--valid');
    const invalidSquares = document.querySelectorAll('.--invalid');
    if (validSquares)
      validSquares.forEach((square) => square.classList.remove('--valid'));
    if (invalidSquares)
      invalidSquares.forEach((square) => square.classList.remove('--invalid'));
    const boardDivs = document.querySelectorAll('.player-board .square');

    newCoor.forEach((coor) => {
      const square = boardDivs[coor];
      if (!square) return;
      square.classList.add(isValid ? '--valid' : '--invalid');
    });
  };

  return {
    renderBoard,
    renderForm,
    renderGame,
    renderSelectShip,
    renderHover,
  };
})();

function createElement(type, className, textContent) {
  const element = document.createElement(type);
  if (className) element.className = className;
  if (textContent) element.textContent = textContent;
  return element;
}

import { playGame } from './playGame.js';
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
        square.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          events.flipShipEvent(isShip, index);
        });
        square.addEventListener('click', () =>
          events.moveShipEvent(player, isShip, index),
        );
        square.addEventListener('mouseenter', () =>
          events.shipHoverEvent(player, index),
        );

        playerBoard.appendChild(square);
      });
    } else {
      computerBoard.textContent = '';

      boardArray.forEach((value, index) => {
        const square = createElement('div', 'square');
        square.addEventListener('click', () => events.attackEvents(index));
        computerBoard.appendChild(square);
      });
    }
  };

  const renderGame = (player, computer) => {
    const root = document.getElementById('root');
    if (root.classList.contains('form--active'))
      root.classList.remove('form--active');
    root.textContent = '';
    const responsiveMsg = createElement(
      'span',
      'responsive-msg',
      'Please Rotate Your Device Horizontally!',
    );
    const header = createElement('header', 'header');
    const headerTitle = createElement('h1', 'header-title', 'Odin Battleship');
    header.appendChild(headerTitle);

    const main = createElement('main', 'main');

    const msgContainer = createElement('div', 'msg-container');
    const msgElement = createElement(
      'span',
      'msg-element',
      'Place your ships!',
    );
    const mainContent = createElement('div', 'main-content');

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

    const playButton = createElement(
      'button',
      'play-btn --btn-active',
      'Start',
    );
    const computerBoard = createElement('div', 'computer-board');
    computerBoardContainer.append(computerNameSpan, computerBoard);

    msgContainer.appendChild(msgElement);

    mainContent.append(
      playerBoardContainer,
      playButton,
      computerBoardContainer,
    );
    main.append(msgContainer, mainContent);
    root.append(header, responsiveMsg, main);
    playButton.addEventListener('click', () => {
      events.playButtonEvents();
    });
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

  const renderAttack = (player, index, attack) => {
    const board = document.querySelectorAll(
      player.isPlayer ? '.player-board .square' : '.computer-board .square',
    );
    const div = board[index];
    const msgElement = document.querySelector('.msg-element');
    if (attack) {
      const isSunk = attack.isSunk();
      if (isSunk) {
        attack.coordinates.forEach((coor) => {
          const img = createElement('img', 'sunk-icon');
          img.src = 'icons/sunk.png';
          board[coor].textContent = '';
          board[coor].appendChild(img);
        });
        const allShipsSunk = player.game.allShipsSunk();
        if (allShipsSunk) {
          msgElement.textContent = player.isPlayer
            ? "Our fleet has been destroyed. We've lost this battle..."
            : "We've destroyed the enemy fleet! Victory is ours!";
        } else {
          msgElement.textContent = player.isPlayer
            ? 'Commander, the enemy has sunk a ship!'
            : "We've sunk a ship Commander, give us your next order!";
        }
      } else {
        msgElement.textContent = player.isPlayer
          ? 'Commander, our ship has been hit!'
          : "You've hit a ship Commander, give us your next order!";
        const img = createElement('img', 'hit-icon');

        img.src = 'icons/hit.png';
        div.textContent = '';
        div.appendChild(img);
      }
    } else {
      msgElement.textContent = player.isPlayer
        ? "The enemy missed their shot, let's give them hell!"
        : "We've missed Commander, brace for impact!";
      const img = createElement('img', 'miss-icon');

      img.src = 'icons/miss.png';
      div.textContent = '';
      div.appendChild(img);
    }
  };

  const renderPlayButton = (gameState) => {
    const playButton = document.querySelector('.play-btn');
    if (gameState.gameActive) {
      playButton.textContent = 'Quit';
      playButton.classList.remove('--btn-active');
    } else {
      playButton.textContent = 'Start';
      playButton.classList.add('--btn-active');
    }
  };

  return {
    renderBoard,
    renderForm,
    renderGame,
    renderSelectShip,
    renderHover,
    renderAttack,
    renderPlayButton,
  };
})();

function createElement(type, className, textContent) {
  const element = document.createElement(type);
  if (className) element.className = className;
  if (textContent) element.textContent = textContent;
  return element;
}

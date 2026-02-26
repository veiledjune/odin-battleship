import { render } from './render.js';
import { getCoordinates } from './getCoordinates.js';
import { validateShipPlacement } from './validate.js';
import { playGame } from './app.js';

export const events = (() => {
  const gameState = playGame.getGameState();

  const moveShipEvent = (player, ship, index) => {
    if (gameState.gameActive) return;
    render.renderSelectShip(ship);
    const rerender = player.game.moveShip(ship, index);
    if (rerender) render.renderBoard(player);
  };

  const shipHoverEvent = (player, newIndex) => {
    if (gameState.gameActive) return;

    const shipState = player.game.getShipState();
    if (!shipState.selectedShip) return;
    const newCoor = getCoordinates.getNewCoordinates(
      shipState.selectedShip,
      shipState.initialIndex,
      newIndex,
    );
    const [maxShips, currentShips] = player.game.getShips();
    const currShips = {
      ...currentShips,
      [`l${shipState.selectedShip.length}`]:
        currentShips[`l${shipState.selectedShip.length}`] - 1,
    };
    const isValid = validateShipPlacement(
      newCoor,
      shipState.selectedShip.length,
      player.game.getGameboard(),
      maxShips,
      currShips,
    );
    render.renderHover(isValid, newCoor);
  };

  const flipShipEvent = (ship, index) => {
    const [player, computer] = playGame.getPlayers();
    const shipState = player.game.getShipState();

    if (gameState.gameActive) return;
    const rerender = player.game.flipShip(ship, index, shipState);
    if (rerender) {
      render.renderBoard(player);
    } else
      setTimeout(() => {
        const invalidSquares = document.querySelectorAll('.--invalid');
        invalidSquares.forEach((square) =>
          square.classList.remove('--invalid'),
        );
      }, 1500);
  };

  const playButtonEvents = () => {
    const [player, computer] = playGame.getPlayers();

    if (!gameState.gameActive) {
      gameState.gameActive = true;
      gameState.playerTurn = true;
      render.renderPlayButton(gameState);
      playGame.resetPlayerBoards();
      render.renderBoard(player);
      render.renderBoard(computer);
    } else {
      playGame.resetGameState();
      render.renderPlayButton(gameState);
      playGame.resetPlayerBoards();
      render.renderBoard(player);
      render.renderBoard(computer);
    }
  };

  const attackEvents = (index) => {
    const [player, computer] = playGame.getPlayers();

    if (gameState.gameActive) {
      if (gameState.playerTurn) {
        const prevMoves = computer.game.getPrevMoves();
        if (prevMoves.has(index)) return;
        const attack = computer.game.receiveAttack(index);
        render.renderAttack(computer, index, attack);
        if (attack) {
          const isSunk = attack.isSunk();
          if (isSunk) {
            const allShipsSunk = computer.game.allShipsSunk();
            if (allShipsSunk) {
              playGame.resetGameState();
              render.renderPlayButton(gameState);
            }
          }
        } else {
          gameState.playerTurn = false;
          playGame.computerMove();
        }
      }
    }
  };

  return {
    moveShipEvent,
    shipHoverEvent,
    playButtonEvents,
    attackEvents,
    flipShipEvent,
  };
})();

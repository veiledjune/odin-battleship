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

  const playButtonEvents = () => {
    const playButton = document.querySelector('.play-btn');
    console.log(playButton);

    if (!gameState.gameActive) {
      playButton.textContent = 'Quit';
      playButton.classList.remove('--btn-active');
      console.log(gameState);
    } else {
      playButton.textContent = 'Start';
      playButton.classList.add('--btn-active');
    }
    gameState.gameActive = !gameState.gameActive;
    console.log(gameState);
  };
  return { moveShipEvent, shipHoverEvent, playButtonEvents };
})();

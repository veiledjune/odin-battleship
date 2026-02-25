import { render } from './render.js';
import { getCoordinates } from './getCoordinates.js';
import { validateShipPlacement } from './validate.js';

export const events = (() => {
  const moveShipEvent = (player, ship, index) => {
    render.renderSelectShip(ship);
    const rerender = player.game.moveShip(ship, index);
    if (rerender) render.renderBoard(player);
  };

  const shipHoverEvent = (player, newIndex) => {
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
  return { moveShipEvent, shipHoverEvent };
})();

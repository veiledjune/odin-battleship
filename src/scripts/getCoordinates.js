import { validateShipPlacement } from './validate.js';

export const getCoordinates = (() => {
  const getRandomCoordinates = (
    shipLength,
    gameboard,
    maxShips,
    currentShips,
  ) => {
    const coordinates = [];
    for (let i = 0; i <= 99; i++) {
      const row = Math.floor(i / 10);
      const col = i % 10;

      if (col + (shipLength - 1) <= 9) {
        const coor = [];
        for (let j = 0; j < shipLength; j++) {
          coor.push(i + j);
        }
        coordinates.push(coor);
      }

      if (col - shipLength + 1 >= 0) {
        const coor = [];
        for (let j = 0; j < shipLength; j++) {
          coor.push(i - j);
        }
        coordinates.push(coor);
      }

      if (row + (shipLength - 1) <= 9) {
        const coor = [];
        for (let j = 0; j < shipLength; j++) {
          coor.push(i + j * 10);
        }
        coordinates.push(coor);
      }

      if (row - shipLength + 1 >= 0) {
        const coor = [];
        for (let j = 0; j < shipLength; j++) {
          coor.push(i - j * 10);
        }
        coordinates.push(coor);
      }
    }
    shuffleArray(coordinates);

    for (const coor of coordinates) {
      const isValid = validateShipPlacement(
        coor,
        shipLength,
        gameboard,
        maxShips,
        currentShips,
      );
      if (isValid) return coor;
    }
  };

  const getNewCoordinates = (ship, initialIndex, newIndex) => {
    const difference = newIndex - initialIndex;
    const newCoor = [];
    ship.coordinates.forEach((coor) => newCoor.push(coor + difference));
    return newCoor;
  };

  return { getRandomCoordinates, getNewCoordinates };
})();

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

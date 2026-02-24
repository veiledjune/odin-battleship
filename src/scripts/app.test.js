import { Ship, Gameboard } from './app.js';
import { validateShipPlacement } from './validate.js';

test('Valid if ship length is 3', () => {
  const ship = new Ship([0, 1, 2], 3);
  expect(ship.length).toBe(3);
});

test('Valid if ship hitCount is incremented', () => {
  const ship = new Ship(3);
  ship.hit();
  ship.hit();
  expect(ship.hitCount).toBe(2);
});

test('Valid if isSunk is true', () => {
  const ship = new Ship([0], 1);
  ship.hit();
  expect(ship.sunk).toBe(true);
});

test('Valid if isSunk is false', () => {
  const ship = new Ship([0, 1], 2);
  ship.hit();
  expect(ship.sunk).toBe(false);
});

test('Invalid if shipLength & coordinates.length do not match', () => {
  const game = Gameboard();
  const board = game.getGameboard();
  const [maxShips, currentShips] = game.getShips();

  expect(
    validateShipPlacement([0, 1, 2], 2, board, maxShips, currentShips),
  ).toBe(false);
});

test('Valid if shipLength & coordinates.length match', () => {
  const game = Gameboard();
  const board = game.getGameboard();
  const [maxShips, currentShips] = game.getShips();
  expect(
    validateShipPlacement([0, 1, 2], 3, board, maxShips, currentShips),
  ).toBe(true);
});

test('Invalid if coordinate.length is less than shipLength', () => {
  const game = Gameboard();
  const board = game.getGameboard();
  const [maxShips, currentShips] = game.getShips();
  expect(validateShipPlacement([0, 1], 3, board, maxShips, currentShips)).toBe(
    false,
  );
});

test('Invalid if coordinate.length is greater than 4', () => {
  const game = Gameboard();
  const board = game.getGameboard();
  const [maxShips, currentShips] = game.getShips();
  expect(
    validateShipPlacement([0, 1, 2, 3, 4], 4, board, maxShips, currentShips),
  ).toBe(false);
});

test('Invalid if shipLength is greater than 4', () => {
  const game = Gameboard();
  const board = game.getGameboard();
  const [maxShips, currentShips] = game.getShips();
  expect(
    validateShipPlacement([0, 1, 2, 3], 5, board, maxShips, currentShips),
  ).toBe(false);
});

test('Invalid if coordinates.length is less than 1', () => {
  const game = Gameboard();
  const board = game.getGameboard();
  const [maxShips, currentShips] = game.getShips();
  expect(validateShipPlacement([], 4, board, maxShips, currentShips)).toBe(
    false,
  );
});

test('Invalid if shipLength is less than 1', () => {
  const game = Gameboard();
  const board = game.getGameboard();
  const [maxShips, currentShips] = game.getShips();
  expect(validateShipPlacement([1], 0, board, maxShips, currentShips)).toBe(
    false,
  );
});

test('Invalid if a coordinate is out of bounds', () => {
  const game = Gameboard();
  const board = game.getGameboard();
  const [maxShips, currentShips] = game.getShips();
  expect(validateShipPlacement([-1], 1, board, maxShips, currentShips)).toBe(
    false,
  );
  expect(validateShipPlacement([100], 1, [], maxShips, currentShips)).toBe(
    false,
  );
});

test('Valid if coordinate is within bounds', () => {
  const game = Gameboard();
  const board = game.getGameboard();
  const [maxShips, currentShips] = game.getShips();
  expect(validateShipPlacement([99], 1, board, maxShips, currentShips)).toBe(
    true,
  );
});

test('Invalid if coordinates already contain a ship', () => {
  const game = Gameboard();
  const board = game.getGameboard();
  const [maxShips, currentShips] = game.getShips();
  board[70] = true;
  expect(
    validateShipPlacement([60, 70, 80], 3, board, maxShips, currentShips),
  ).toBe(false);
});

test("Valid if coordinates don't contain a ship", () => {
  const game = Gameboard();
  const board = game.getGameboard();
  const [maxShips, currentShips] = game.getShips();
  expect(
    validateShipPlacement([60, 70, 80], 3, board, maxShips, currentShips),
  ).toBe(true);
});

test('Invalid if coordinates are duplicated', () => {
  const game = Gameboard();
  const board = game.getGameboard();
  const [maxShips, currentShips] = game.getShips();
  expect(
    validateShipPlacement([60, 70, 70], 3, board, maxShips, currentShips),
  ).toBe(false);
});

test('Valid if ships do not exceed limit', () => {
  const game = Gameboard();
  const board = game.getGameboard();
  const [maxShips, currentShips] = game.getShips();
  currentShips.l4 = 1;
  currentShips.l3 = 2;
  expect(
    validateShipPlacement([50, 40, 30, 20], 4, board, maxShips, currentShips),
  ).toBe(false);
  expect(
    validateShipPlacement([4, 5, 6], 3, board, maxShips, currentShips),
  ).toBe(false);
  expect(
    validateShipPlacement([10, 11], 2, board, maxShips, currentShips),
  ).toBe(true);
});

test('Valid if ships do not wrap', () => {
  const game = Gameboard();
  const board = game.getGameboard();
  const [maxShips, currentShips] = game.getShips();

  expect(
    validateShipPlacement([8, 9, 10], 3, board, maxShips, currentShips),
  ).toBe(false);
  expect(validateShipPlacement([9, 10], 2, board, maxShips, currentShips)).toBe(
    false,
  );
});

test('Valid if ship was placed on board', () => {
  const game = Gameboard();
  const board = game.getGameboard();
  game.placeShip([60, 70, 80], 3);
  expect(board[60]).toEqual({
    coordinates: [60, 70, 80],
    length: 3,
    hitCount: 0,
    sunk: false,
  });
  expect(board[70]).toEqual({
    coordinates: [60, 70, 80],
    length: 3,
    hitCount: 0,
    sunk: false,
  });
  expect(board[80]).toEqual({
    coordinates: [60, 70, 80],
    length: 3,
    hitCount: 0,
    sunk: false,
  });
});

import { Ship } from './app.js';

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

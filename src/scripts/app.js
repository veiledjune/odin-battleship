export class Ship {
  constructor(coordinates, length) {
    this.coordinates = coordinates;
    this.length = length;
    this.hitCount = 0;
    this.sunk = false;
  }

  hit() {
    this.hitCount++;
    this.isSunk();
  }

  isSunk() {
    if (this.hitCount === this.length) this.sunk = true;
    return this.sunk;
  }
}

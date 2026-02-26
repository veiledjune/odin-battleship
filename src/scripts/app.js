import { validateShipPlacement } from './validate.js';
import { getCoordinates } from './getCoordinates.js';
import { render } from './render.js';

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

export class Player {
  constructor(playerName = 'Computer', isPlayer = false) {
    this.playerName = playerName;
    this.isPlayer = isPlayer;
    this.game = Gameboard();
  }
}

export const Gameboard = () => {
  const gameboard = new Array(100).fill(null);
  const missedAttacks = new Set();
  const prevMoves = new Set();
  const placedShips = new Set();

  const maxShips = {
    l1: 4,
    l2: 3,
    l3: 2,
    l4: 1,
  };

  const currentShips = {
    l1: 0,
    l2: 0,
    l3: 0,
    l4: 0,
  };

  const getGameboard = () => gameboard;

  const getShips = () => [maxShips, currentShips];

  const placeShip = (coordinates, shipLength) => {
    const isValid = validateShipPlacement(
      coordinates,
      shipLength,
      gameboard,
      maxShips,
      currentShips,
    );

    if (isValid) {
      const ship = new Ship(coordinates, shipLength);
      coordinates.forEach((coordinate) => (gameboard[coordinate] = ship));
      currentShips[`l${shipLength}`]++;
      placedShips.add(ship);
    }
  };

  const receiveAttack = (coordinate) => {
    if (!prevMoves.has(coordinate)) {
      const attackLocation = gameboard[coordinate];
      if (attackLocation) {
        attackLocation.hit();
      } else missedAttacks.add(coordinate);
      prevMoves.add(coordinate);
      return attackLocation;
    }
  };

  const getMissedAttacks = () => missedAttacks;

  const getPrevMoves = () => prevMoves;

  const allShipsSunk = () => [...placedShips].every((ship) => ship.sunk);

  const randomizeShips = () => {
    gameboard.fill(null);
    placedShips.clear();
    for (let i = 1; i <= 4; i++) currentShips[`l${i}`] = 0;
    let shipLength = 4;
    while (shipLength > 0) {
      while (currentShips[`l${shipLength}`] < maxShips[`l${shipLength}`]) {
        const coordinates = getCoordinates.getRandomCoordinates(
          shipLength,
          gameboard,
          maxShips,
          currentShips,
        );
        placeShip(coordinates, shipLength);
      }
      shipLength--;
    }
  };

  const moveShipState = {
    selectedShip: null,
    initialIndex: null,
    newIndex: null,
  };

  const clearShipState = () => {
    moveShipState.selectedShip = null;
    moveShipState.initialIndex = null;
    moveShipState.newIndex = null;
  };

  const getShipState = () => moveShipState;

  const moveShip = (ship, index) => {
    if (!ship && !moveShipState.selectedShip) return;
    if (ship) {
      if (!moveShipState.selectedShip) {
        moveShipState.selectedShip = ship;
        moveShipState.selectedShip.coordinates.forEach(
          (coor) => (gameboard[coor] = null),
        );
        moveShipState.initialIndex = index;
      } else if (moveShipState.selectedShip) {
        moveShipState.selectedShip.coordinates.forEach(
          (coor) => (gameboard[coor] = moveShipState.selectedShip),
        );
        moveShipState.selectedShip = ship;
        moveShipState.selectedShip.coordinates.forEach(
          (coor) => (gameboard[coor] = null),
        );
        moveShipState.initialIndex = index;
      }
    } else {
      moveShipState.newIndex = index;
      const newCoor = getCoordinates.getNewCoordinates(
        moveShipState.selectedShip,
        moveShipState.initialIndex,
        moveShipState.newIndex,
      );
      const currShips = {
        ...currentShips,
        [`l${moveShipState.selectedShip.length}`]:
          currentShips[`l${moveShipState.selectedShip.length}`] - 1,
      };
      const isValid = validateShipPlacement(
        newCoor,
        moveShipState.selectedShip.length,
        gameboard,
        maxShips,
        currShips,
      );
      if (isValid) {
        moveShipState.selectedShip.coordinates = newCoor;
        newCoor.forEach(
          (coor) => (gameboard[coor] = moveShipState.selectedShip),
        );
        clearShipState();
        return true;
      } else {
        moveShipState.selectedShip.coordinates.forEach(
          (coor) => (gameboard[coor] = moveShipState.selectedShip),
        );
        clearShipState();
      }
    }
  };

  const flipShip = (ship, index) => {
    if (!ship) return;
    ship.coordinates.forEach((coor) => (gameboard[coor] = null));
    const isHorizontal =
      Math.abs(ship.coordinates[0] - ship.coordinates[1]) === 1;
    const newCoor = [];
    if (!isHorizontal) {
      for (let i = 0; i < ship.length; i++) {
        newCoor.push(index + i);
      }
    } else {
      for (let i = 0; i < ship.length; i++) {
        newCoor.push(index + i * 10);
      }
    }
    const currShips = { ...currentShips };
    currShips[`l${ship.length}`]--;
    const isValid = validateShipPlacement(
      newCoor,
      ship.length,
      gameboard,
      maxShips,
      currShips,
    );

    if (isValid) {
      ship.coordinates = newCoor;
      newCoor.forEach((coor) => (gameboard[coor] = ship));
      return isValid;
    } else {
      ship.coordinates.forEach((coor) => (gameboard[coor] = ship));
      const boardDivs = document.querySelectorAll('.player-board .square');
      newCoor.forEach((coor) => boardDivs[coor].classList.add('--invalid'));
    }
    return isValid;
  };

  const resetBoard = () => {
    missedAttacks.clear();
    prevMoves.clear();
    const ships = [...placedShips];
    ships.forEach((ship) => {
      ship.hitCount = 0;
      ship.sunk = false;
    });
  };

  return {
    getGameboard,
    getShips,
    placeShip,
    receiveAttack,
    getMissedAttacks,
    getPrevMoves,
    allShipsSunk,
    randomizeShips,
    moveShip,
    getShipState,
    resetBoard,
    flipShip,
  };
};

export const playGame = (() => {
  const gameState = {
    gameActive: false,
    playerTurn: true,
  };
  const players = [];
  const createPlayers = (playerName) => {
    const player = new Player(playerName, true);

    const computer = new Player();
    player.game.randomizeShips();
    computer.game.randomizeShips();
    players.push(player, computer);
  };

  const getPlayers = () => players;

  const getGameState = () => gameState;

  const resetGameState = () => {
    gameState.gameActive = false;
    gameState.playerTurn = true;
  };

  const resetPlayerBoards = () => {
    const [player, computer] = players;
    player.game.resetBoard();
    computer.game.resetBoard();
    computer.game.randomizeShips();
  };

  const getComputerMove = (player) => {
    const previousMoves = player.game.getPrevMoves();
    const availableMoves = [];
    for (let i = 0; i <= 99; i++) {
      if (previousMoves.has(i)) continue;
      availableMoves.push(i);
    }
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    const randomMove = availableMoves[randomIndex];
    return randomMove;
  };

  const computerMove = () => {
    const [player] = players;
    console.log(player.game.getGameboard());

    const randomMove = getComputerMove(player);
    if (gameState.gameActive && !gameState.playerTurn) {
      const attack = player.game.receiveAttack(randomMove);
      render.renderAttack(player, randomMove, attack);
      if (attack) {
        console.log(attack);

        const isSunk = attack.isSunk();
        if (isSunk) {
          const allShipsSunk = player.game.allShipsSunk();
          if (allShipsSunk) {
            playGame.resetGameState();
            render.renderPlayButton(gameState);
          } else computerMove();
        } else computerMove();
      } else {
        gameState.playerTurn = true;
        return [attack, randomMove];
      }
    }
  };

  return {
    createPlayers,
    getPlayers,
    getGameState,
    resetGameState,
    resetPlayerBoards,
    computerMove,
    getComputerMove,
  };
})();

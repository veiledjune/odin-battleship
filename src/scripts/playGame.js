import { Player } from './app.js';
import { render } from './render.js';
import { gameSounds } from './audio.js';

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

  const getNextComputerMove = (player, index, queue) => {
    const prevMoves = player.game.getPrevMoves();
    const leftEdgeIndices = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];
    const rightEdgeIndices = [9, 19, 29, 39, 49, 59, 69, 79, 89];
    const directions = [
      [1, 2, 3],
      [-1, -2, -3],
      [10, 20, 30],
      [-10, -20, -30],
    ];
    for (const array of directions) {
      const moveArray = [];
      for (const value of array) {
        if (leftEdgeIndices.includes(index) && array.includes(-1)) break;
        if (rightEdgeIndices.includes(index) && array.includes(1)) break;

        const move = value + index;
        if (move > 99 || move < 0 || prevMoves.has(move)) continue;
        if (leftEdgeIndices.includes(move) && array.includes(-1)) {
          moveArray.push(move);
          break;
        } else if (rightEdgeIndices.includes(move) && array.includes(1)) {
          moveArray.push(move);
          break;
        }
        moveArray.push(move);
      }
      if (moveArray.length) queue.push(moveArray);
    }
  };

  const getRandomComputerMove = (player) => {
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

  const queue = [];

  const computerMove = () => {
    const [player] = players;
    const randomMove = getRandomComputerMove(player);
    if (gameState.gameActive && !gameState.playerTurn) {
      let attack;
      let move = randomMove;
      if (queue.length) {
        while (queue.length && !queue[0].length) queue.shift();
        if (!queue.length) {
          attack = player.game.receiveAttack(move);
        } else {
          move = queue[0].shift();
          attack = player.game.receiveAttack(move);
        }
      } else attack = player.game.receiveAttack(randomMove);

      if (attack) {
        const isSunk = attack.isSunk();
        if (isSunk) {
          queue.length = 0;
          const allShipsSunk = player.game.allShipsSunk();
          if (allShipsSunk) {
            playGame.resetGameState();
            render.renderPlayButton(gameState);
            return { player, move, attack };
          } else return { player, move, attack };
        } else {
          getNextComputerMove(player, move, queue);
          return { player, move, attack };
        }
      } else {
        if (queue.length) queue.shift();
        gameState.playerTurn = true;
        return { player, move, attack };
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
  };
})();

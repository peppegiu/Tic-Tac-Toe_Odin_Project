import { gameBoard } from "./gameboard";

export const gameManager = function () {
  const playerOneName = "Player One";
  const playerTwoName = "Player Two";
  const board = gameBoard();
  const playerInput = gameinput();
  const players = [
    {
      name: playerOneName,
      symbol: "x",
    },
    {
      name: playerTwoName,
      symbol: "o",
    },
  ];
  let isOver = false;
  const getGameState = function () {
    return [isOver];
  };
  let activePlayer = players[0];
  let switchTurn = function () {
    activePlayer =
      activePlayer == activePlayer[0] ? activePlayer[1] : activePlayer[0];
  };
  let getActivePlayer = () => activePlayer;
  const playRound = function (position) {
    position = parseInt(position);
    if (isOver === false) {
      if (
        position >= 0 &&
        position < 9 &&
        board.getBoard()[0][position] != ""
      ) {
        board.drawToken(getActivePlayer().symbol, position);
        if (board.checkWin(getActivePlayer().symbol) === true) {
          console.log(`${getActivePlayer().name} wins the round!`);
          isOver = true;
        } else if (board.checkDraw() === true) {
          console.log("Draw!");
          isOver = true;
        } else {
          switchTurn();
        }
      }
    } else {
      console.log("restart to play again!");
    }
  };
  const restart = function () {
    if (isOver == true) {
      isOver = false;
      board.restartBoard();
    } else {
      let confirm = prompt("The game is running. Are you sure to end now? s/y");
      if (confirm == "s") {
        isOver = true;
        restart();
      }
    }
  };

  return { playRound, restart, getGameState };
};

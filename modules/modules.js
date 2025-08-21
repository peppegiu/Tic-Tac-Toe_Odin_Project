

export const gameBoard = (function () {
  let board = ["", "", "", "", "", "", "", "", ""];
  let tokenSequence = 0;

  const checkWin = (token) => {
    const endPosition = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [6, 4, 2],
    ];
    for (let i = 0; i < endPosition.length; i++) {
      for (let y = 0; y < endPosition[i].length; y++) {
        if (token == board[endPosition[i][y]]) {
          tokenSequence += 1;
        }
      }
      if (tokenSequence == 3) {
        tokenSequence = 0;
        return true;
      } else {
        tokenSequence = 0;
      }
    }
    return false;
  };
  const checkDraw = () => {
    let marked = 0;
    for (let i = 0; i < board.length; i++) {
      if (board[i] == "") {
        return false;
      } else {
        marked++;
      }
    }
    if (marked == 9) {
      marked = 0;
      return true;
    }
  };
  const drawToken = function (token, position) {
    if (board[position] == "") {
      board[position] = token;
    } else {
      console.log("Error: position not empty");
    }
  };
  const printTable = () => {
    console.log(
      `0: ${board[0]}| 1: ${board[1]}| 2: ${board[2]}\n-----------\n3: ${board[3]}| 4: ${board[4]}| 5: ${board[5]}\n-----------\n6: ${board[6]}| 7: ${board[7]}| 8: ${board[8]}`
    );
  };
  const getBoard = () => board; // copy of board so the actual variable don't get mutated from outer scope
  const restartBoard = () => {
    for (let item of board) {
      item = "";
    }
  };
  return { getBoard, printTable, restartBoard, checkWin, checkDraw, drawToken };
})();

export const gameManager = function () {
  const playerOneName = "Player One";
  const playerTwoName = "Player Two";
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
      activePlayer == players[0] ? players[1] : players[0];
  };
  let getActivePlayer = () => activePlayer;
  const playRound = function (position) {
    position = parseInt(position);
    if (isOver === false) {
      console.log(getActivePlayer())
      if (
        position >= 0 &&
        position < 9 &&
        gameBoard.getBoard()[position] == ""
      ) {
        gameBoard.drawToken(getActivePlayer().symbol, position);
        if (gameBoard.checkWin(getActivePlayer().symbol) === true) {
          console.log(`${getActivePlayer().name} wins the round!`);
          isOver = true;
        } else if (gameBoard.checkDraw() === true) {
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
      gameBoard.restartBoard();
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

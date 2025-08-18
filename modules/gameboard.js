import { gameManager } from "./gamemanager";

export const gameBoard = (function () {
  let board = ["", "", "", "", "", "", "", "", ""];
  const game = gameManager();
  let tokenSequence = 0;

  const checkWin = (token) => {
    const endPosition = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
      [1, 5, 9],
      [7, 5, 3],
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
  const getBoard = () => [board]; // copy of board so the actual variable don't get mutated from outer scope
  const restartBoard = () => {
    for (item of board) {
      item = "";
    }
  };
  return { getBoard, printTable, restartBoard, checkWin, checkDraw, drawToken };
})();

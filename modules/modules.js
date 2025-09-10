import { messageElement} from "../script.js";

export const gameBoard = (function () {
  let board = ["", "", "", "", "", "", "", "", ""];
  let tokenSequence = 0;
  

  const checkWin = (token) => {
    let result;
    const endPosition = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7],[2, 5, 8],
      [0, 4, 8], [6, 4, 2]
    ];
    for (let i = 0; i < endPosition.length; i++) {
      for (let y = 0; y < endPosition[i].length; y++) {
        if (token == board[endPosition[i][y]]) {
          tokenSequence += 1;
        }
      }
      if (tokenSequence == 3) {
        tokenSequence = 0;
        result = true;
        return {result, token} ;
      } else {
        tokenSequence = 0;
      }
    }
    result = false;
    return result;
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
      return {success: true};
    } else {
      return {success: false, error: "position not empty"}
    }
  };
  const printTable = () => {
  // Helper to get X, O, or a space for the current board
  const cell = (index) => board[index] === "" ? " " : board[index].toUpperCase();

  console.log(
    `\n--- CURRENT BOARD ---\n` +
    ` ${cell(0)} | ${cell(1)} | ${cell(2)} \n` +
    `-----------\n` +
    ` ${cell(3)} | ${cell(4)} | ${cell(5)} \n` +
    `-----------\n` +
    ` ${cell(6)} | ${cell(7)} | ${cell(8)} \n\n` + // Extra space for separation
    `--- POSITIONS MAP ---\n` +
    ` 0 | 1 | 2 \n` +
    `-----------\n` +
    ` 3 | 4 | 5 \n` +
    `-----------\n` +
    ` 6 | 7 | 8 \n`
  );
};
  const getBoard = () => [board]; // copy of board so the actual variable don't get mutated from outer scope
  const restartBoard = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };
  const avaliableMoves = () => {
    let moves = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] == "") {
        moves.push(i);
      }
    }
    return moves;
  }

  const undoMove = function (position) {
    board[position] = "";
  }
  return { getBoard, printTable, restartBoard, checkWin, checkDraw, drawToken, avaliableMoves, undoMove};
})();

export const gameManager = (function () {
  const playerOneName = "Player One";
  const playerTwoName = "Player Two";
  const AIname = "AI"
  const players = [
    {
      name: playerOneName,
      is_maximizing: false,
      symbol: "x",
    },
    {
      name: playerTwoName,
      is_maximizing: true,
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
        gameBoard.getBoard()[0][position] == ""
      ) {
        gameBoard.drawToken(getActivePlayer().symbol, position);
        let symbol1 = getActivePlayer()["symbol"];
        if (gameBoard.checkWin(getActivePlayer().symbol).result === true) {
          isOver = true;
          return {status: "win", winner: getActivePlayer()}
        } else if (gameBoard.checkDraw() === true) {
          isOver = true;
          return {status: "draw"}
        } else {
          switchTurn();
          return { status: 'continue', nextPlayer: getActivePlayer()}
        }
      }
    } else {
      messageElement.textContent = "restart to play again!";
    }
  };

  const changeAIName = (isAI) => {
    if (isAI) {
      players[1].name = AIname;
      console.log("changed to AI")
    }
    else {
      players[1].name = playerTwoName;
      console.log("changed to player two name");
    }
  }

  const end = function () {
    if (isOver == true) {
      isOver = false;
      gameBoard.restartBoard();
    }
  };
  const startNewGame = function () {
    isOver = false;
    gameBoard.restartBoard();
    activePlayer = players[0]; // Also reset the active player
  };

  return { playRound, end, getGameState, getActivePlayer, startNewGame, changeAIName };
})();

export const aiPlayer = (function () {
  
  const minimax = function (is_maximizing) {
    
    if (gameBoard.checkWin("o").result) {
      return 1;
    }
    else if (gameBoard.checkWin("x").result) {
      return -1;
    }
    else if (gameBoard.checkDraw()) {
      return 0;
    }
     const availableMoves = gameBoard.avaliableMoves();
    
    if (is_maximizing) {
      let best_score = -Infinity;
      for (const moves of availableMoves) {
        gameBoard.drawToken("o", moves);
        let score = minimax(false);
        gameBoard.undoMove(moves);
        best_score = Math.max(score, best_score);
      }
      return best_score
    }
    else {
      let best_score = Infinity;
      for (const moves of availableMoves) {
        gameBoard.drawToken("x", moves);
        let score = minimax(true);
        gameBoard.undoMove(moves);
        best_score = Math.min(score, best_score);
      }
      return best_score;
    }
  }

  const getBestMove = function () {
   
    
    let best_score = -Infinity;
    let best_move = null;
    const availableMoves = gameBoard.avaliableMoves();
    if (gameManager.getActivePlayer().is_maximizing) {
      for (const moves of availableMoves) {
        gameBoard.drawToken("o", moves);
        let score = minimax(false);
        gameBoard.undoMove(moves);
        if (score > best_score) {
          best_score = score;
          best_move = moves;
        }
      }
      return best_move;
    }
    
  }
  return {getBestMove};
})();


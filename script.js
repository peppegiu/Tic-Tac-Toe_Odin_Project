import { gameBoard, gameManager, aiPlayer } from "./modules/modules.js";
export const messageElement = document.querySelector(".status");

const container = document.querySelector(".container");
const startButton = document.querySelector(".start"); // Renamed to avoid conflict
const twoPlayersInput = document.querySelector(".two-players");
const AImode = document.querySelector(".AI");
const restartButton = document.querySelector(".restart");

const ScreenController = function () {
    const board = gameBoard.getBoard()[0];

    const displayBoard = function (aimode) {
            board.forEach((cell, index) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.column = index;
                cellButton.textContent = cell;
                cellButton.addEventListener("click", () => {
                    const symbol = gameManager.getActivePlayer().symbol
                    playTurn(index, aimode, cellButton);
                    console.log(symbol);
                });
                container.appendChild(cellButton);
            }) 
            blockBoard();
        }               
    const blockBoard = function () {
        const cellsButtons = container.childNodes;
        cellsButtons.forEach((cell) => {
            cell.disabled = true;
        })
    }

    const enableBoard = function () {
        const cellsButtons = container.childNodes;
        cellsButtons.forEach((cell) => {
            cell.disabled = false;
        })
    }

    const playTurn = (index, aimode, cell) => {
        if (gameManager.getGameState()[0] || !gameBoard.getBoard()[0][index] == "") {
            return;
        }
        let result = gameManager.playRound(index); 
        updateMove();
        if (result.status == "continue") {
            messageElement.textContent = `${gameManager.getActivePlayer().symbol.toUpperCase()} turn`
        }
        let symbol = gameManager.getActivePlayer().symbol;
        const gameState = gameManager.getGameState()[0];
        if (gameState && !gameBoard.checkDraw()) {
            endGame(gameManager.getActivePlayer().name);
            return;
        } else if (gameBoard.checkDraw()) {
            endGame(false);
        }
        if (aimode) {                    
            if (gameManager.getActivePlayer().is_maximizing) {
                messageElement.textContent = "AI is thinking...";
                blockBoard();

                setTimeout(() => {
                    const aiMove = aiPlayer.getBestMove();
                    gameManager.playRound(aiMove);
                    symbol = gameManager.getActivePlayer.symbol;
                    cell.textContent = symbol;
                    updateMove();
                    

                    const aiGameState = gameManager.getGameState()[0];
                    if (aiGameState && !gameBoard.checkDraw()) {
                        endGame(gameManager.getActivePlayer().name);
                    } else if (!aiGameState && !gameBoard.checkDraw()) {
                        messageElement.textContent = "Your Turn";
                        enableBoard();
                    } else if (gameBoard.checkDraw()){
                        endGame(false);
                    }    
                }, 700);
            }
        }
    };

    const start = function () {
        if (!gameManager.getGameState()[0]) {
            if (AImode.checked) {
                gameManager.changeAIName(true);
                displayBoard(true); 
                updateMove();
                enableBoard();
            }
            else if (twoPlayersInput.checked) {
                gameManager.changeAIName(false);
                displayBoard(false);
                updateMove();
                enableBoard();
            }
            else {
                messageElement.textContent = "None selected";
            }
            startButton.disabled = true;
        } 
    }

    const updateMove = function () {
        const board = gameBoard.getBoard()[0];
        const cells = container.children;
        for (let i = 0; i < cells.length; i++) {
            cells[i].textContent = board[i].toUpperCase();
        }
    }

    const endGame = (winner) => {
        blockBoard();
        if (winner) {
            messageElement.textContent = `${winner} wins!`;
        } else {
            messageElement.textContent = "It's a draw!";
        }
        container.innerHTML = "";
        restartButton.disabled = false;
    };
    
    return {start, enableBoard, blockBoard, displayBoard, updateMove};    
}

window.onload = function () {
    restartButton.disabled = true;
    const DOMControler = ScreenController();
    startButton.addEventListener("click", () => DOMControler.start())
    restartButton.addEventListener("click", () => {
        gameManager.end();
        DOMControler.updateMove();
        restartButton.disabled = true;
        startButton.disabled = false;
    })
}



import { gameBoard, gameManager, aiPlayer } from "./modules/modules.js";
export const messageElement = document.querySelector(".status");

const container = document.querySelector(".container");
const startButton = document.querySelector(".start"); // Renamed to avoid conflict
const twoPlayersInput = document.querySelector(".two-players");
const AImode = document.querySelector(".AI");


const ScreenController = function () {
    const board = gameBoard.getBoard();

    const displayBoard = function (aimode) {
            board.forEach((cell, index) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.column = index;
                cellButton.textContent = cell;
                cellButton.addEventListener("click", () => {
                    const symbol = gameManager.getActivePlayer().symbol
                    playTurn(index, aimode);
                    console.log(symbol);
                    cellButton.textContent = symbol;
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

    const playTurn = (index, aimode) => {
        if (gameManager.getGameState()[0] || !gameBoard.getBoard()[index] == "") {
            return;
        }
        gameManager.playRound(index);
        updateMove();
        const gameState = gameManager.getGameState()[0];
        if (gameState) {
            endGame(gameManager.getActivePlayer().name);
            return;
        }
        if (aimode) {        
            if (gameManager.getActivePlayer().is_maximizing) {
                messageElement.textContent = "AI is thinking...";
                blockBoard();

                setTimeout(() => {
                    const aiMove = aiPlayer.getBestMove();
                    gameManager.playRound(aiMove);
                    updateMove();
                    

                    const aiGameState = gameManager.getGameState()[0];
                    if (aiGameState) {
                        endGame(gameManager.getActivePlayer().name);
                    } else {
                        messageElement.textContent = "Your Turn";
                        enableBoard();
                    }    
                }, 700);
            }
        }
    };

    const start = function () {
        if (!gameManager.getGameState()[0]) {
            if (AImode.checked) {
                displayBoard(true); 
                updateMove();
                enableBoard();
            }
            else if (twoPlayersInput.checked) {
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
        const board = gameBoard.getBoard();
        const cells = container.children;
        for (let i = 0; i < cells.length; i++) {
            cells[i].textContent = board[i].toUpperCase();
        }
    }

    const endGame = (winner) => {
        blockBoard();
        if (winner) {
            messageElement.textContent = `${winner.name} wins!`;
        } else {
            messageElement.textContent = "It's a draw!";
        }
    };

    
    return {start, enableBoard, blockBoard, displayBoard, updateMove};    
}

window.onload = function () {
    const DOMControler = ScreenController();
    startButton.addEventListener("click", () => DOMControler.start())
}



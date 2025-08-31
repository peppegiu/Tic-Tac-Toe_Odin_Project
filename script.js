import { gameBoard, gameManager, aiPlayer } from "./modules/modules.js";



const gameInput = function () {
    let input;

    const greetings = function () {
        console.log("Bem vindo ao pedra, papel e tesoura");
    }
    const displayOn = function () {
        gameBoard.printTable();
        input = prompt("Insira na posição desejada: ");
        gameManager.playRound(Number(input));
    }
    const getInput = function () {
        if (input) {
            return input;
        }
        else {
            return null;
        }
    }

    const showMenu = function () {
        console.log("1 - Two players mode");
        console.log("2 - AI mode")
        console.log("3 - exit");
        let option = prompt("Insert a option: ")
        switch (option) {
            case "1": 
                gameManager.startNewGame();
                start();
                break;
            case "2":
                gameManager.startNewGame();
                aiMode();
                break;

            default: 
                console.log(`Error: ${option} is not a valid option`);
        }
    }

    const start = function () {
        console.log("starting...");
        gameBoard.restartBoard();
        greetings();
        while (gameManager.getGameState()[0] == false) {
            displayOn();
        }
    }
    const aiMode = function () {
        console.log("starting...");
        greetings();
        while (gameManager.getGameState()[0] == false) {
            gameBoard.printTable();
            if (gameManager.getActivePlayer().is_maximizing) {
                console.log("AI is thinking...")
                let move = aiPlayer.getBestMove();
                gameManager.playRound(move);
            }
            else {
                displayOn();
            }
            
        }
    }

    return {start, showMenu};
}

const game = gameInput();
game.showMenu();
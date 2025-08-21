import { gameBoard, gameManager } from "./modules/modules.js";



const gameInput = function () {
    const gamemanager = gameManager();
    let input;

    const greetings = function () {
        console.log("Bem vindo ao pedra, papel e tesoura");
        displayOn();
    }
    const displayOn = function () {
        gameBoard.printTable();
        input = prompt("Insira na posição desejada: ");
        gamemanager.playRound(Number(input));
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
        console.log("1 - continue");
        console.log("2 - exit");
        let option = prompt("Insert a option: ")
        switch (option) {
            case "1": 
                start();
                break;
            case "2":
                break;
            default: 
                console.log(`Error: ${option} is not a valid option`);
        }
    }

    const start = function () {
        console.log("starting...");
        gameBoard.restartBoard();
        greetings();
        while (gamemanager.getGameState()[0] == false) {
            displayOn();
        }
        showMenu();
    }

    return {start};
}

const game = gameInput();
game.start();
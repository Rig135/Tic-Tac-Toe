const GameBoard = (function () {
    const rows = 3;
    const columns = 3;

    const board = [];

    //2d array board
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i][j] = "";
        }
    }

    const getBoard = () => board;

    const addMarker = (player, selectedRow, selectedCol) => {
        // let position = prompt(`${player.name}'s turn....  Enter the position (1-9): `);
        // while (position > 9 || position < 1) {
        //     console.error("Please Enter correct position: ");
        //     position = prompt(`${player.name}'s turn....  Enter the position (1-9): `);
        // }
        // let selectedRow = Math.floor((position - 1) / columns);
        // let selectedCol = Math.floor((position - 1) % columns);

        if (board[selectedRow][selectedCol] != "") {
            console.error("Position Already Taken!!!!");
            return false;
            // position = prompt(`${player.name}'s turn....  Enter the position (1-9): `);
            // selectedRow = Math.floor((position - 1) / columns);
            // selectedCol = Math.floor((position - 1) % columns);
        }
        board[selectedRow][selectedCol] = player.marker;
        return true;
    }

    return { getBoard, addMarker };
})();





const player = (name, marker) => {
    return { name, marker }
};

const Player1 = player("Harshit", "❌");
const Player2 = player("Vaskil", "⭕");




// GameBoard.getBoard();

const gameController = (function (Player1, Player2) {
    const board = GameBoard;

    const players = [Player1, Player2];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        console.log(board.getBoard());
    }

    let isGameOver = false;

    const gameOver = () => isGameOver;

    const playRound = (row, col) => {
        const Board = board.getBoard();
        board.addMarker(getActivePlayer(), row, col);


        //logic for winning condition
        const marker = getActivePlayer().marker;
        for (let i = 0; i < 3; i++) {
            //Row Wise Check:

            if (Board[i][0] === Board[i][1] && Board[i][1] === Board[i][2] && Board[i][2] === marker) {
                isGameOver = true;
                break;
            }

            //Column Wise Check
            if (Board[0][i] === Board[1][i] && Board[1][i] === Board[2][i] && Board[2][i] === marker) {
                isGameOver = true;
                break;
            }

        }

        // Main Diagonal Check
        if (Board[0][0] === Board[1][1] && Board[1][1] === Board[2][2] && Board[2][2] === marker) {
            isGameOver = true;
        }

        //Anti Diagonal Check
        if (Board[2][0] === Board[1][1] && Board[1][1] === Board[0][2] && Board[0][2] === marker) {
            isGameOver = true;
        }

        //Checking For Draw
        let emptySpace = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (Board[i][j] == "") emptySpace++;
            }
        }
        // If its a Draw
        if (emptySpace === 0 && isGameOver === false) {
            console.log("Its a DRAW!!!!");
            isGameOver = true;
            return "draw";
        }

        if (isGameOver == false) {
            switchPlayerTurn();
            printNewRound();
            return "continue";
        }
        else {
            console.log(`${getActivePlayer().name} Has Won!!!`);
            return "win";
        }


    }
    printNewRound();

    return {
        playRound,
        getActivePlayer,
        gameOver,
        getBoard: board.getBoard
    };

})(Player1, Player2);


function ScreenController() {
    const game = gameController;
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
        //clear board
        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        //Displaying Players turn
        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

        //render Board
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cellButton = document.createElement('button');
                cellButton.classList.add('cell');

                cellButton.dataset.row = i;
                cellButton.dataset.column = j;

                cellButton.textContent = board[i][j];
                boardDiv.appendChild(cellButton);
            }
        }
    }

    function clickHandlerBoard(e) {
        if (game.gameOver == true) {
            return;
        }
        const selectedCol = parseInt(e.target.dataset.column);
        const selectedRow = parseInt(e.target.dataset.row);

        if (isNaN(selectedCol) || isNaN(selectedRow)) return;

        const finished = game.playRound(selectedRow, selectedCol);
        updateScreen();

        if (finished === "win") {

            boardDiv.style.pointerEvents = "none";
            playerTurnDiv.textContent = `${game.getActivePlayer().name} wins! 🎉`;
        }
        else if (finished === "draw") {
            boardDiv.style.pointerEvents = "none";
            playerTurnDiv.textContent = `It's a Draw!`;
        }


    }
    boardDiv.addEventListener('click', clickHandlerBoard);

    updateScreen();
};

ScreenController();





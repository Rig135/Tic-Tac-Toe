const player = (name, marker) => {
    return { name, marker }
};

let Player1;
let Player2;




window.addEventListener('DOMContentLoaded', () => {

    const dialog = document.querySelector('dialog');
    dialog.showModal();

    const selectMarkerP1 = document.getElementById('markerP1');
    const selectMarkerP2 = document.getElementById('markerP2');

    selectMarkerP1.addEventListener("change", () => {
        selectMarkerP2.value = selectMarkerP1.value;
        selectMarkerP2.disabled = true;
    })

    const form = document.querySelector('#playerform');
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Stop actual form post
        if (form.checkValidity()) { // Make sure both required fields are filled

            let P1name = document.querySelector('#Player1name').value.trim();
            let P2name = document.querySelector('#Player2name').value.trim();



            let P1marker = selectMarkerP1.options[selectMarkerP1.selectedIndex].text;
            let P2marker = selectMarkerP2.options[selectMarkerP2.selectedIndex].text;

            Player1 = player(P1name, P1marker);
            Player2 = player(P2name, P2marker);


            dialog.close();

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

                    if (board[selectedRow][selectedCol] != "") {
                        console.error("Position Already Taken!!!!");
                        return false;
                    }
                    board[selectedRow][selectedCol] = player.marker;
                    return true;
                }

                return { getBoard, addMarker };
            })();









            const gameController = (function () {
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

                const reset = () => {
                    const Board = board.getBoard();
                    //empty the 2d board Array
                    for (let i = 0; i < 3; i++) {
                        for (let j = 0; j < 3; j++) {
                            Board[i][j] = "";
                        }
                    }

                    isGameOver = false;
                    activePlayer = players[0];
                }

                const playRound = (row, col) => {
                    const Board = board.getBoard();
                    if (!board.addMarker(getActivePlayer(), row, col)) return "continue";


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
                    getBoard: board.getBoard,
                    reset
                };

            })();


            function ScreenController() {
                const game = gameController;
                const playerTurnDiv = document.querySelector('.turn');
                const boardDiv = document.querySelector('.board');

                const Restart = document.querySelector('.restart');

                Restart.addEventListener('click', () => {
                    game.reset();

                    //Re-enable the board
                    boardDiv.style.pointerEvents = "auto";
                    updateScreen();
                })

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
                        confetti({
                            particleCount: 100,
                            spread: 70,
                            origin: { y: 0.6 }
                        });

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
        }

    })
})




// const Player1 = player(P1name, "❌");
// const Player2 = player(P2name, "⭕");










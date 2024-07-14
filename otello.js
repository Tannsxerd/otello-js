const readline = require('readline');
const boardSize = 8;
let board = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null));
let currentPlayer = "B";

function initBoard() {
    board[3][3] = 'W';
    board[3][4] = 'B';
    board[4][3] = 'B';
    board[4][4] = 'W';
}

const direct = [
    [0, 1], [1, 0], [0, -1], [-1, 0],
    [1, 1], [1, -1], [-1, 1], [-1, -1]
];

function renderBoard() {
    console.clear();
    let position = 1;
    for (let row = 0; row < boardSize; row++) {
        let rowString = ''; // Remove row number
        for (let col = 0; col < boardSize; col++) {
            if (ValidMove(row, col)) {
                rowString += (position < 10 ? ' ' : '') + position + ' ';
            } else {
                rowString += ' ' + (board[row][col] || '*') + ' ';
            }
            position++;
        }
        console.log(rowString);
    }
}
function ValidMove(row,col){
    if (board[row][col]) return false;

    for(let[dx,dy] of direct){
        let x = row + dx;
        let y = col + dy;
        let OpponentBetween = false;
         
        while (x >= 0 && x < boardSize && y >= 0 && y < boardSize) {
            if (!board[x][y]) break;
            if (board[x][y] === currentPlayer){
                if (OpponentBetween) return true;
                break;
            }
            OpponentBetween = true;

            x += dx;
            y += dy;

        }
    }
    return false;
}


initBoard();
renderBoard();

const readline = require('readline');
const boardSize = 8;
let board = [];
let currentPlayer = 'B';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});


for (let row = 0; row < boardSize; row++) {
    board[row] = [];
    for (let col = 0; col < boardSize; col++) {
        board[row][col] = null;
    }
}


function initBoard() {
    board[3][3] = 'W';
    board[3][4] = 'B';
    board[4][3] = 'B';
    board[4][4] = 'W';
}


const directions = [
    [0, 1], [1, 0], [0, -1], [-1, 0],
    [1, 1], [1, -1], [-1, 1], [-1, -1]
];


function renderBoard() {
    console.clear();
    let position = 1;
    for (let row = 0; row < boardSize; row++) {
        let rowString = '';
        for (let col = 0; col < boardSize; col++) {
            if (ValidMove(row, col)) {
                rowString += (position < 10 ? ' ' : '') + position + ' ';
            } else {
                rowString += ' ' + (board[row][col] || '.') + ' ';
            }
            position++;
        }
        console.log(rowString);
    }
}

function ValidMove(row, col) {
    if (board[row][col]) return false;
    for (let [dx, dy] of directions) {
        let x = row + dx;
        let y = col + dy;
        let oppo_between = false;
        while (x >= 0 && x < boardSize && y >= 0 && y < boardSize) {
            if (!board[x][y]) break;
            if (board[x][y] === currentPlayer) {
                if (oppo_between) return true;
                break;
            }
            oppo_between = true;
            x += dx;
            y += dy;
        }
    }
    return false;
}

function moveandflip(row, col) {
    board[row][col] = currentPlayer;
    for (let [dx, dy] of directions) {
        let x = row + dx;
        let y = col + dy;
        let flip_ls = [];
        while (x >= 0 && x < boardSize && y >= 0 && y < boardSize) {
            if (!board[x][y]) break;
            if (board[x][y] === currentPlayer) {
                for (let [fx, fy] of flip_ls) {
                    board[fx][fy] = currentPlayer;
                }
                break;
            }
            flip_ls.push([x, y]);
            x += dx;
            y += dy;
        }
    }
}


function handleInput(input) {

    const position = parseInt(input) - 1;
    const row = Math.floor(position / boardSize);
    const col = position % boardSize;
    if (ValidMove(row, col)) {
        moveandflip(row, col);
        currentPlayer = currentPlayer === 'B' ? 'W' : 'B';
        if(!hasValidMove()){
            currentPlayer =  currentPlayer === 'B' ? 'W' : 'B';
            if (!hasValidMove()) {
                endGame();
                return;
            }
        }
        renderBoard();
        promptMove();
    } else {
        console.log('Invalid move. Try again.');
        promptMove();
    }
}


function promptMove() {
    rl.question(`Player ${currentPlayer}, enter your move (1-64): `, handleInput);
}

function hasValidMove(){
    for (let row = 0 ;row <boardSize;row++){
        for (let col = 0 ;col <boardSize;col++){
            if(ValidMove(row,col)){
                return true;
            }
        }
    }
    return false;
}
function endGame() {
    let blackCount = 0;
    let whiteCount = 0;

    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (board[row][col] === 'B') blackCount++;
            if (board[row][col] === 'W') whiteCount++;
        }
    }

    console.log(`Game over!`);
    console.log(`Black: ${blackCount}, White: ${whiteCount}`);
    rl.close();
}


initBoard();
renderBoard();
promptMove();

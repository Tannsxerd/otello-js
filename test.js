const readline = require('readline');
boardSize = 8

let board = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null));
let currentPlayer = 'B';

const directions = [
    [0, 1], [1, 0], [0, -1], [-1, 0],
    [1, 1], [1, -1], [-1, 1], [-1, -1]
];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function initializeBoard() {
    board[3][3] = 'W';
    board[3][4] = 'B';
    board[4][3] = 'B';
    board[4][4] = 'W';
}

function renderBoard() {
    console.clear();
    let position = 1;
    for (let row = 0; row < boardSize; row++) {
        let rowString = ''; // Remove row number
        for (let col = 0; col < boardSize; col++) {
            if (isValidMove(row, col)) {
                rowString += (position < 10 ? ' ' : '') + position + ' ';
            } else {
                rowString += ' ' + (board[row][col] || '.') + ' ';
            }
            position++;
        }
        console.log(rowString);
    }
    console.log(`Current Player: ${currentPlayer}`);
}

function handleInput(input) {
    const position = parseInt(input) - 1;
    const row = Math.floor(position / boardSize);
    const col = position % boardSize;

    if (isValidMove(row, col)) {
        makeMove(row, col);
        currentPlayer = currentPlayer === 'B' ? 'W' : 'B';
        if (!hasValidMove(currentPlayer)) {
            currentPlayer = currentPlayer === 'B' ? 'W' : 'B';
            if (!hasValidMove(currentPlayer)) {
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

function isValidMove(row, col) {
    if (board[row][col]) return false;

    for (let [dx, dy] of directions) {
        let x = row + dx;
        let y = col + dy;
        let hasOpponentBetween = false;

        while (x >= 0 && x < boardSize && y >= 0 && y < boardSize) {
            if (!board[x][y]) break;
            if (board[x][y] === currentPlayer) {
                if (hasOpponentBetween) return true;
                break;
            }
            hasOpponentBetween = true;
            x += dx;
            y += dy;
        }
    }
    return false;
}

function makeMove(row, col) {
    board[row][col] = currentPlayer;

    for (let [dx, dy] of directions) {
        let x = row + dx;
        let y = col + dy;
        let toFlip = [];

        while (x >= 0 && x < boardSize && y >= 0 && y < boardSize) {
            if (!board[x][y]) break;
            if (board[x][y] === currentPlayer) {
                for (let [fx, fy] of toFlip) {
                    board[fx][fy] = currentPlayer;
                }
                break;
            }
            toFlip.push([x, y]);
            x += dx;
            y += dy;
        }
    }
}

function hasValidMove(player) {
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (isValidMove(row, col)) {
                return true;
            }
        }
    }
    return false;
}

function promptMove() {
    rl.question('Enter your move (1-64): ', handleInput);
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

initializeBoard();
renderBoard();
promptMove();
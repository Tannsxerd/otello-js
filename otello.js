const readline = require('readline');

// Board class to manage the game board and game logic
class Board {
    constructor() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'B'; // 'B' for black, 'W' for white
        this.players = {}; // To hold player types
    }

    // Initialize the board with starting pieces
    initializeBoard() {
        let board = Array(8).fill(null).map(() => Array(8).fill(null));
        board[3][3] = 'W';
        board[3][4] = 'B';
        board[4][3] = 'B';
        board[4][4] = 'W';
        return board;
    }

    // Print the board with row and column labels
    printBoard() {
        const columns = '  0 1 2 3 4 5 6 7';
        console.log(columns);
        this.board.forEach((row, i) => {
            console.log(`${i} ${row.map(cell => cell || '.').join(' ')}`);
        });
    }

    // Switch the current player
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'B' ? 'W' : 'B';
    }

    // Check if a move is valid
    isValidMove(position) {
        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1],
            [-1, -1], [-1, 1], [1, -1], [1, 1]
        ];
        const [x, y] = position;
        if (this.board[x][y] !== null) return false;

        const opponent = this.currentPlayer === 'B' ? 'W' : 'B';
        for (let [dx, dy] of directions) {
            let nx = x + dx, ny = y + dy, foundOpponent = false;
            while (nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && this.board[nx][ny] === opponent) {
                foundOpponent = true;
                nx += dx;
                ny += dy;
            }
            if (foundOpponent && nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && this.board[nx][ny] === this.currentPlayer) {
                return true;
            }
        }
        return false;
    }

    // Place a piece on the board
    placePiece(position) {
        if (this.isValidMove(position)) {
            const directions = [
                [-1, 0], [1, 0], [0, -1], [0, 1],
                [-1, -1], [-1, 1], [1, -1], [1, 1]
            ];
            const [x, y] = position;
            this.board[x][y] = this.currentPlayer;

            const opponent = this.currentPlayer === 'B' ? 'W' : 'B';
            for (let [dx, dy] of directions) {
                let nx = x + dx, ny = y + dy, path = [];
                while (nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && this.board[nx][ny] === opponent) {
                    path.push([nx, ny]);
                    nx += dx;
                    ny += dy;
                }
                if (path.length && nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && this.board[nx][ny] === this.currentPlayer) {
                    for (let [px, py] of path) {
                        this.board[px][py] = this.currentPlayer;
                    }
                }
            }
            this.switchPlayer();
        }
    }

    // Check if there are valid moves left
    hasValidMoves() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.isValidMove([i, j])) return true;
            }
        }
        return false;
    }

    // Calculate the score for both players
    calculateScore() {
        let black = 0, white = 0;
        for (let row of this.board) {
            for (let cell of row) {
                if (cell === 'B') black++;
                if (cell === 'W') white++;
            }
        }
        return { black, white };
    }

    // Display the game over message with the scores
    gameOver() {
        let score = this.calculateScore();
        console.log(`Game Over! Black: ${score.black}, White: ${score.white}`);
        console.log(score.black > score.white ? 'Black wins!' : 'White wins!');
    }

    // Display possible moves for the current player
    displayPossibleMoves() {
        let possibleMoves = [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.isValidMove([i, j])) {
                    possibleMoves.push([i, j]);
                }
            }
        }
        console.log('Possible moves:', possibleMoves);
        return possibleMoves;
    }
}

// Game class to manage the game flow
class Game {
    constructor() {
        this.board = new Board();
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.players = {};
    }

    // Select game mode (PvP or PvBot)
    selectMode() {
        this.rl.question('Select mode: 1 for PvP, 2 for PvBot: ', (mode) => {
            if (mode === '1') {
                this.players.player1 = new Player('B', this.rl);
                this.players.player2 = new Player('W', this.rl);
            } else if (mode === '2') {
                this.players.player1 = new Player('B', this.rl);
                this.players.player2 = new Bot('W', 'easy');
            } else {
                console.log('Invalid mode. Please select again.');
                return this.selectMode();
            }
            this.play();
        });
    }

    // Play the game
    play() {
        const playTurn = () => {
            if (this.board.hasValidMoves()) {
                this.board.printBoard();
                this.board.displayPossibleMoves();
                const currentPlayer = this.board.currentPlayer;
                const player = currentPlayer === 'B' ? this.players.player1 : this.players.player2;
                console.log(`Current turn: ${currentPlayer}`);
                player.getMove((position) => {
                    if (this.board.isValidMove(position)) {
                        this.board.placePiece(position);
                        playTurn();
                    } else {
                        console.log("Invalid move. Try again.");
                        playTurn();
                    }
                });
            } else {
                this.board.gameOver();
                this.rl.close();
            }
        };

        playTurn();
    }
}

// Player class for human players
class Player {
    constructor(piece, rl) {
        this.playerPiece = piece;
        this.rl = rl;
    }

    // Get the move from the player
    getMove(callback) {
        this.rl.question('Enter your move (row,col): ', (input) => {
            const [row, col] = input.split(',').map(Number);
            callback([row, col]);
        });
    }
}

// Bot class for bot players
class Bot {
    constructor(piece, difficulty) {
        this.botPiece = piece;
        this.difficulty = difficulty;
        this.scoreBoard = this.initializeScoreBoard();
    }

    // Initialize the score board for the bot
    initializeScoreBoard() {
        return [
            [100, -10, 10, 5, 5, 10, -10, 100],
            [-10, -20, 1, 1, 1, 1, -20, -10],
            [10, 1, 5, 2, 2, 5, 1, 10],
            [5, 1, 2, 1, 1, 2, 1, 5],
            [5, 1, 2, 1, 1, 2, 1, 5],
            [10, 1, 5, 2, 2, 5, 1, 10],
            [-10, -20, 1, 1, 1, 1, -20, -10],
            [100, -10, 10, 5, 5, 10, -10, 100]
        ];
    }

    // Get the move from the bot
    getMove(callback) {
        const boardCopy = new Board();
        boardCopy.board = JSON.parse(JSON.stringify(this.board.board));
        boardCopy.currentPlayer = this.botPiece;
        let move = this.bestMove(boardCopy);
        callback(move);
    }

    // Find the best move for the bot
    bestMove(board) {
        let bestScore = -Infinity;
        let move = null;

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (board.isValidMove([i, j])) {
                    let score = this.scoreBoard[i][j];
                    if (score > bestScore) {
                        bestScore = score;
                        move = [i, j];
                    }
                }
            }
        }
        return move;
    }
}

// Start the game
let game = new Game();
game.selectMode();

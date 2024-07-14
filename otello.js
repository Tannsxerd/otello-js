class Othello {
    constructor() {
        this.board =  this.create2DArray(8,8)
        this.int_piece()
    }
    int_piece(){
        this.board[3][3] = "white"
        this.board[4][4] = "white"
        this.board[3][4] = "black"
        this.board[4][3] = "black"
    }
    create2DArray(row, col) {
        let array = [];
        for (let i = 0; i < row; i++) {
            array[i] = [];
            for (let j = 0; j < col; j++) {
                array[i][j] = null; // Example initialization, replace with your logic
            }
        } 
        return array; 
    }
    user_input(){
        
    }
}

let game = new Othello();
console.log(game.board)
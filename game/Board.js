// A Board represents a Connect 4 game board. The main functionality is the ability to make moves. 
class Board {
    // Constructs an empty Board with the given width and height
    constructor(width, height) {
        this.board = Array.from(Array(width), () => new Array(height).fill(0));
        this.columnHeights = Array(width).fill(0);
        this.width = width;
        this.height = height;
    }

    // Makes a move on column x (zero-indexed) of the Board, using the specified token. Returns the row (zero-indexed) of the move, or -1 if the move is invalid.
    makeMove(x, token) {
        if (x < 0 || x >= this.width || this.columnHeights[x] >= this.height) {
            return -1;
        }
        this.board[x][this.columnHeights[x]++] = token;
        return this.columnHeights[x] - 1;
    }

    // Returns the token in the space specified by x and y (both zero-indexed), or returns 0 if the space is empty. 
    getToken(x, y) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
            return -1;
        }
        return this.board[x][y];
    }

    // Returns the number of tokens in the column specified by x (zero-indexed).
    getColumnHeight(x) {
        return this.columnHeights[x];
    }

    // Returns the width of the board. 
    getWidth() {
        return this.width;
    }

    // Returns a deep copy of the board.
    copy() {
        let copy = new Board(this.width, this.height);
        for (let x = 0; x < this.board.length; x++) {
            for (let y = 0; y < this.columnHeights[x]; y++) {
                copy.makeMove(x, this.board[x][y]);
            }
        }
        return copy;
    }

    // Removes the highest token in the column specified by x (zero-indexed), or does nothing if there are no tokens in the column.
    unMakeMove(x) {
        if (this.columnHeights[x] != 0) {
            this.board[x][--this.columnHeights[x]] = 0;
        }
    }

    // Returns true if the board is completely filled with tokens, false otherwise. 
    isFull() {
        for (let i = 0; i < this.width; i++) {
            if (this.columnHeights[i] < this.height) {
                return false;
            }
        }
        return true;
    }

    // Prints a command line representation of the board, for debug purposes.
    printBoard() {
        for (let x = 0; x < this.width + 2; x++) {
            process.stdout.write("— ");
        }
        console.log();
        for (let y = this.height - 1; y >= 0; y--) {
            process.stdout.write("| ");
            for (let x = 0; x < this.width; x++) {
                if (this.board[x][y] == 0) {
                    process.stdout.write("@ ");
                } else {
                    process.stdout.write(this.board[x][y] + " ");
                }
            }
            console.log("|");
        }
        for (let x = 0; x < this.width + 2; x++) {
            process.stdout.write("— ");
        }
        console.log();
        process.stdout.write("  ");
        for (let x = 0; x < this.width; x++) {
            process.stdout.write((x + 1) + " ");
        }
        console.log();
        console.log();
    }
}

module.exports = Board;
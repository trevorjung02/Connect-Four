class Board {
    constructor(width, height) {
        this.board = Array.from(Array(width), () => new Array(height).fill(0));
        this.columnHeights = Array(width).fill(0);
        this.width = width;
        this.height = height;
    }

    makeMove(x, token) {
        if (x < 0 || x >= this.width || this.columnHeights[x] >= this.height) {
            return -1;
        }
        this.board[x][this.columnHeights[x]++] = token;
        return this.columnHeights[x] - 1;
    }

    getToken(x, y) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
            return -1;
        }
        return this.board[x][y];
    }

    getColumnHeight(x) {
        return this.columnHeights[x];
    }

    getWidth() {
        return this.width;
    }

    copy() {
        let copy = new Board(this.width, this.height);
        for (let x = 0; x < this.board.length; x++) {
            for (let y = 0; y < this.columnHeights[x]; y++) {
                copy.makeMove(x, this.board[x][y]);
            }
        }
        return copy;
    }

    unMakeMove(x) {
        if (this.columnHeights[x] != 0) {
            this.board[x][--this.columnHeights[x]] = 0;
        }
    }

    isFull() {
        for (let i = 0; i < this.width; i++) {
            if (this.columnHeights[i] < this.height) {
                return false;
            }
        }
        return true;
    }

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
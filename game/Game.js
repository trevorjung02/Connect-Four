const Board = require('./Board');
const Player = require('./Player');

// A Game represents the state of a Connect Four game. Includes players, a board, and functionality to make moves and check for victory.
class Game {
    // Directions are used to check for victory. The order is important for iteration purposes. 
    static directions = [[- 1, -1], [1, 1], [-1, 0], [1, 0], [-1, 1], [1, -1],
    [0, -1]];

    // pre: moveGetters is an array of functions that return a move.
    //      width, height are integers representing the dimensions of the board. 
    //      victoryCondition is an integer representing the number of pieces in a row needed to win. 
    // post: Constructs a Game with the given parameters
    constructor(moveGetters, width, height, victoryCondition) {
        this.board = new Board(width, height);
        this.victoryCondition = victoryCondition;
        this.players = [];
        this.turnToPlay = 1;
        for (let i = 0; i < moveGetters.length; i++) {
            this.players.push(new Player(i + 1, moveGetters[i]));
        }
    }

    // pre: x is an integer representing the column (zero-indexed) where the move is to be made. Required for a human-made move, optional and has no effect on an AI move. 
    //      token is an integer representing the player making the move. Required for both humans and AI. 
    // post: Makes the move and returns an object of the form {x,y,token,state}, or null if the move is invalid. 
    //      x and y are the coordinates of the move (zero-indexed)
    //      token is the input token. 
    //      The returned state is as follows: 0 if the game is ongoing, 1 if the game has ended in a draw, 2 if the player making the move has won.
    makeMove(token, x = null) {
        if (token != this.turnToPlay) {
            return null;
        }
        let curPlayer = this.players[token - 1];
        // console.log(`getMove: ${curPlayer.getMove}`);
        let y = null;
        if (curPlayer.getMove == null) {
            if (x == null) {
                return null;
            }
            y = this.board.makeMove(x, token);
            if (y == -1) {
                return null;
            }
        }
        else {
            x = curPlayer.getMove(this.board, token, this.players, this.victoryCondition);
            y = this.board.makeMove(x, token);
            while (y == -1) {
                x = curPlayer.getMove(this.board, token, this.players, this.victoryCondition);
                y = this.board.makeMove(x, token);
            }
        }
        if (Game.victory(x, this.board, this.victoryCondition)) {
            return { x, y, token, state: 1 };
        }
        if (this.board.isFull()) {
            return { x, y, token, state: 2 };
        }
        this.turnToPlay = this.turnToPlay % 2 + 1;
        return { x, y, token, state: 0 };
    }

    // pre: x is an integer representing a column (zero-indexed).
    //      board is a Board object
    //      victoryCondition is an integer representing the number of connected pieces in order to win
    // post: Returns true if the last piece played in the column results in a victory. Otherwise returns false.
    static victory(x, board, victoryCondition) {
        let y = board.getColumnHeight(x) - 1;
        let token = board.getToken(x, y);
        let directionResults = 0;
        for (let i = 0; i < Game.directions.length; i++) {
            directionResults += Game.consecutivePieces(x, y, token, board, victoryCondition, Game.directions[i]);
            if (directionResults + 1 >= victoryCondition) {
                return true;
            }
            if (i % 2 != 0) {
                directionResults = 0;
            }
        }
        return false;
    }

    // Helper method for the function victory. 
    // pre: x, y are integers representing the coordinates (zero-indexed) of a piece. 
    //      token is an integer representing the token in the given space.
    //      board is a Board object
    //      victoryCondition is an integer representing the number of pieces   in a row needed to win.  
    //      direction is a two element array. direction[0] represents the change in x for the next consecutive piece. direction[1] represents the change in y.
    // post: Returns the number of consecutive pieces matching the token and going in the given direction, starting from and excluding the specified space.
    static consecutivePieces(x, y, token, board, victoryCondition, direction) {
        for (let i = 0; i < victoryCondition - 1; i++) {
            x += direction[0];
            y += direction[1];
            if (board.getToken(x, y) != token) {
                return i;
            }
        }
        return victoryCondition - 1;
    }
}

module.exports = Game;
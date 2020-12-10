const Board = require('./Board');
const Player = require('./Player');

class Game {
    static directions = [[- 1, -1], [1, 1], [-1, 0], [1, 0], [-1, 1], [1, -1],
    [0, -1]];

    constructor(moveGetters, width, height, victoryCondition) {
        this.board = new Board(width, height);
        this.victoryCondition = victoryCondition;
        this.players = [];
        this.turnToPlay = 1;
        for (let i = 0; i < moveGetters.length; i++) {
            this.players.push(new Player(i + 1, moveGetters[i]));
        }
    }

    makeMove({ x = null, token }) {
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
        if (Game.victory(x, token, this.board, this.victoryCondition)) {
            return { x, y, token, state: 1 };
        }
        if (this.board.isFull()) {
            return { x, y, token, state: 2 };
        }
        this.turnToPlay = this.turnToPlay % 2 + 1;
        return { x, y, token, state: 0 };
    }

    static victory(x, token, board, victoryCondition) {
        let y = board.getColumnHeight(x) - 1;
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
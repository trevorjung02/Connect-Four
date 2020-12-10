const Game = require('./Game');

function GetAIMove(board, token, players, victoryCondition) {
    let copy = board.copy();
    let moves = computeScore(copy, token, players, victoryCondition, 0).moves;
    let move = moves[Math.floor(Math.random() * (moves.length))];
    console.log(`AI move: ${move + 1}`);
    return move;
}

function computeScore(board, token, players, victoryCondition, depth) {
    if (board.isFull() || depth == 7) {
        return new Turn([0], 0, depth, depth);
    }
    let moves = [];
    let score = 2;
    let defeatDepth = Number.MIN_SAFE_INTEGER;
    let victoryDepth = Number.MAX_SAFE_INTEGER;
    for (let x = 0; x < board.getWidth(); x++) {
        if (board.makeMove(x, token) == -1) {
            continue;
        }
        if (Game.victory(x, token, board, victoryCondition)) {
            board.unMakeMove(x);
            return new Turn([x], 1, depth, depth);
        }
        let curMove = computeScore(board, token % 2 + 1, players, victoryCondition, depth + 1);
        let curScore = curMove.score;
        if (curScore < score) {
            moves = [x];
            score = curScore;
        } else if (curScore == 1 && curMove.victoryDepth > defeatDepth && score == 1) {
            defeatDepth = curMove.victoryDepth;
            moves = [x];
        } else if (curScore == 0 && score == 0) {
            moves.push(x);
        } else if (curScore == -1 && curMove.defeatDepth < victoryDepth) {
            victoryDepth = curMove.defeatDepth;
            moves = [x];
        }
        board.unMakeMove(x);
    }
    if (score < 1) {
        defeatDepth = Number.MIN_SAFE_INTEGER;
    }
    // if (depth <= 1) {
    //     board.printBoard();
    //     console.log("Player " + token + " Moves: " + moves.map(x => x + 1) + " Score: " +
    //         (-score) + " Victory Depth: "
    //         + victoryDepth + " Defeat Depth: " + defeatDepth);
    //     console.log("-----");
    // }
    return new Turn(moves, -score, victoryDepth, defeatDepth);
}

class Turn {
    constructor(moves, score, victoryDepth, defeatDepth) {
        this.moves = moves;
        this.score = score;
        this.victoryDepth = victoryDepth;
        this.defeatDepth = defeatDepth;
    }
}

module.exports = GetAIMove;
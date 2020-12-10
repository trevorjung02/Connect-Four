const Game = require('./Game');

// pre: board is a Board object
//      token is an integer representing the AI's token 
//      players is an array of Player objects, representing all the players in the game. 
//      victoryCondition is an integer representing the number of pieces in a row needed to win
// post: Returns an integer representing the column (zero-indexed) the AI has chosen.
function GetAIMove(board, token, players, victoryCondition) {
    let copy = board.copy();
    let moves = computeScore(copy, token, players, victoryCondition, 0).moves;
    let move = moves[Math.floor(Math.random() * (moves.length))];
    console.log(`AI move: ${move + 1}`);
    return move;
}

// Helper method for GetAIMove.
// pre: board is a Board object
//      token is an integer representing the token of the player currently making a move.
//      players is an array of Player objects, representing all the players in the game. 
//      victoryCondition is an integer representing the number of pieces in a row needed to win.
//      depth is an integer representing how many turns have taken place since the intial turn that GetAIMove was called on. 
//  post: Returns a Turn object with the following properties: moves, scores, victoryDepth, defeatDepth. 
//       scores is an integer representing the best score that can be achieved (looking ahead 6 turns). The scores are as follows: -1 if there is guaranteed loss, 0 if indeterminate or guaranteed draw, 1 if guaranteed win. 
//      moves is an array containing the best possible moves (all with the same score), each element is an integer representing a column-index. 
//      victoryDepth is an integer representing the minimum number of turns for a guaranteed victory 
//      defeatDepth is an integer representing the maximum number of turns for a guaranteed defeat
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
        if (Game.victory(x, board, victoryCondition)) {
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
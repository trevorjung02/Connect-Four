// A Player represents a player in a Connect Four game. Has a token, and a getMove field that contains a function returning the player's moves.
class Player {
    constructor(token, getMove) {
        this.token = token;
        this.getMove = getMove;
    }

    getToken() {
        return this.token;
    }
}

module.exports = Player;

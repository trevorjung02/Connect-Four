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

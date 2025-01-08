const gameState = {
    players: [], // List of players who joined
    currentPhase: "day", // Default is "day"
    votes: {}, // Track votes cast by players

    addPlayer(name) {
        if (!this.players.some((player) => player.name === name)) {
            this.players.push({ name });
        }
    },

    getPlayers() {
        return this.players;
    },

    setPhase(phase) {
        this.currentPhase = phase;
    },

    getPhase() {
        return this.currentPhase;
    },

    castVote(voter, selectedPlayer) {
        this.votes[voter] = selectedPlayer;
    },

    resetVotes() {
        this.votes = {};
    },
};

export default gameState;

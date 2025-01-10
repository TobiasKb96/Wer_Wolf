import LobbyParticipants from "../../../components/LobbyParticipants.jsx";

class GameState {
    constructor() {
        this.players = []; // List of players who joined
        this.currentPhase = "day"; // Default is "day"
        this.votes = {}; // Track votes cast by players
        this.sessionId = "";
    }

    // Add a player if they are not already in the list
    addPlayer(player) {
        if (!this.players.some(existingPlayer => existingPlayer.id === player.id)) {
            this.players.push(player);
        }
    }

    // Set the entire list of players
    setPlayers(players) {
        this.players = players;
    }

    // Get the current list of players
    getPlayers() {
        return this.players;
    }

    // Set the current game phase (day/night)
    setPhase(phase) {
        this.currentPhase = phase;
    }

    // Get the current game phase
    getPhase() {
        return this.currentPhase;
    }

    // Record a vote from a voter for a selected player
    castVote(voter, selectedPlayer) {
        this.votes[voter] = selectedPlayer;
    }

    // Reset all votes
    resetVotes() {
        this.votes = {};
    }

    // Get the current session ID
    getSessionID() {
        return this.sessionId;
    }

    // Set the session ID
    setSessionID(id) {
        this.sessionId = id;
    }

    findPlayerById(id) {
        return this.players.find(player => player.id === id);
    }
}

export default new GameState();

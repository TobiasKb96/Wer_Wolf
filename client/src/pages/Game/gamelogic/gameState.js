const gameState ={
    currentPhase: 'day',
    players: [],

    addPlayer(name){
        this.players.push(name);
    },

    setPhase(phase){
        this.currentPhase = phase;
    },

    getPhase(){
        return this.currentPhase;
    },

    getPlayers(){
        return this.players;
    }
};

export default gameState;
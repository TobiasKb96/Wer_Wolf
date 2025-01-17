
module.exports = (io, socket) => {


    socket.on('startGame', (sessionId) => {
        //debugging
        io.lobbies[sessionId].forEach((user) => {
            if (user.id !== socket.id) {
                socket.to(user.id).emit('gameStarted', user);
                console.log(user.id);
                console.log(user);
                socket.emit('gameStartedForNarrator', io.lobbies[sessionId])
            }
        });
    });

    socket.on('sendPlayers', (players) => {
        console.log(players);
        const sessionId = getSessionId(socket);
        console.log("Session ID of narrator sending player to games: ", sessionId);
        socket.to(sessionId).emit('playersReceived', players);
    });

    socket.on('sendPhase', (currentPhase) => {
        const sessionId = getSessionId(socket);
        socket.to(sessionId).emit('phaseReceived', currentPhase);
    });

    socket.on('witchNightAction' , ()=> {
        console.log("server socket is listening")
        const sessionId = getSessionId(socket);
        socket.to(sessionId).emit('witchShowPotions');
    });

    socket.on('healingPotion' , ()=> {
        const sessionId = getSessionId(socket);
        socket.to(sessionId).emit('useHealingPotion');
    });

    socket.on('poisonPotion' , ()=> {
        const sessionId = getSessionId(socket);
        socket.to(sessionId).emit('usePoisonPotion');
    });


    socket.on('revealRole', (revealedPlayer) =>{
        const sessionId = getSessionId(socket);
        socket.to(sessionId).emit('showRole', revealedPlayer);
    })

};

const getSessionId = (socket) => {
    // Get the sessionId (assuming it's the first custom room the socket joined)
    for (const room of socket.rooms) {
        if (room !== socket.id) return room; // Skip the default room (socket.id)
    }
    return null;
};

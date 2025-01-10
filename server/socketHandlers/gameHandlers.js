
module.exports = (io, socket) => {


    socket.on('startGame', (sessionId) => {
        //debugging
        io.lobbies[sessionId].forEach((user) => {
            if (user.id !== socket.id) {
                socket.to(user.id).emit('gameStarted', user);
                socket.emit('gameStartedForNarrator', io.lobbies[sessionId])
                console.log(user.id);
                console.log(user);
            }
        });
    });

    socket.on('sendPlayers', (players) => {
        console.log(players);
        const sessionId = getSessionId(socket);
        console.log("Session ID of narrator sending player to games: ", sessionId);
        socket.to(sessionId).emit('playersReceived', players);
    });
};

const getSessionId = (socket) => {
    // Get the sessionId (assuming it's the first custom room the socket joined)
    for (const room of socket.rooms) {
        if (room !== socket.id) return room; // Skip the default room (socket.id)
    }
    return null;
};

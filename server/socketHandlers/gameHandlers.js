
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

    socket.on('sendPlayers', (player) => {
        so



    });
};



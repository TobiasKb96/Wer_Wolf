const {v4: uuidv4} = require("uuid");
const lobbies = {}; // Store lobby participants

module.exports = (io, socket) => {
    socket.on('joinLobby', ({sessionId, name}) => {
        if (!lobbies[sessionId]) {
            lobbies[sessionId] = [];
        }
        if (lobbies[sessionId].some(user => user.id === socket.id || user.name === name)) {
            socket.emit('JoinError','User already exists in the lobby');
        }
        else {
            lobbies[sessionId].push({id: socket.id, name: name}); // Add participant as an object
            io.to(sessionId).emit('updateParticipants', lobbies[sessionId]);

            socket.join(sessionId);
            socket.emit('playerJoinedSuccessfully', {name});
            console.log(`Player ${name} with ID: ${socket.id} joined session ${sessionId}`);
        }
    });


    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
        // Clean up on disconnect
        for (const sessionId in lobbies) {
            lobbies[sessionId] = lobbies[sessionId].filter(user => user.id !== socket.id);
            socket.leave(sessionId)
            io.to(sessionId).emit('updateParticipants', lobbies[sessionId]);

        }
    });

    socket.on('getParticipants', (sessionId) => {
        socket.emit('updateParticipants', lobbies[sessionId]);
        console.log(`${socket.id} requested Participants to ${sessionId}`);
    });



    socket.on('createGame', () => {
        const sessionId = uuidv4();
        socket.join(sessionId);
        io.to(socket.id).emit('gameCreated', { sessionId });
        console.log(`Game created with session ID: ${sessionId}`);
    });




    function generateSessionId() {
        return uuidv4();
    }

};

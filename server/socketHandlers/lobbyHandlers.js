const {v4: uuidv4} = require("uuid");
const lobbies = {}; // Store lobby participants

module.exports = (io, socket) => {
    socket.on('joinLobby', (sessionId, name) => {
        if (!lobbies[sessionId]) {
            lobbies[sessionId] = [];
        }

        lobbies[sessionId].push(socket.id); // Add participant
        io.to(sessionId).emit('updateParticipants', lobbies[sessionId]);

        socket.join(sessionId);
        io.to(sessionId).emit('playerJoined', { name });
        console.log(`Player ${name} joined session ${sessionId}`);
    });

    socket.on('leaveLobby', (sessionId) => {
        if (lobbies[sessionId]) {
            lobbies[sessionId] = lobbies[sessionId].filter(id => id !== socket.id);
            io.to(sessionId).emit('updateParticipants', lobbies[sessionId]);
        }

        socket.leave(sessionId);
    });

    socket.on('disconnect', () => {
        // Clean up on disconnect
        for (const sessionId in lobbies) {
            lobbies[sessionId] = lobbies[sessionId].filter(id => id !== socket.id);
            io.to(sessionId).emit('updateParticipants', lobbies[sessionId]);
        }
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

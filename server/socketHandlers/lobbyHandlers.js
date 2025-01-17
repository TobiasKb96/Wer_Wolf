const {v4: uuidv4} = require("uuid");


module.exports = (io, socket) => {

    if (!io.lobbies) {
        io.lobbies = {}; // Initialize a container for session-specific data
    }
    if (!io.narrators) {
        io.narrators = {}; // Initialize a container for narrators
    }
    
    console.log(`${socket.id} connected`)

    socket.on('joinLobby', ({sessionId, name}) => {
        if (!io.lobbies[sessionId]) {
            io.lobbies[sessionId] = [];
        }
        if (io.lobbies[sessionId].some(user => user.id === socket.id || user.name === name)) {
            socket.emit('JoinError','User already exists in the lobby');
        }
        else {
            io.lobbies[sessionId].push({id: socket.id, name: name}); // Add participant as an object
            io.to(sessionId).emit('updateParticipants', io.lobbies[sessionId]);

            socket.join(sessionId);
            socket.emit('playerJoinedSuccessfully', socket.id);
            console.log(`Player ${name} with ID: ${socket.id} joined session ${sessionId}`);
        }
    });




    socket.on('getParticipantRole', ({sessionId, name}) => {
        const role = io.lobbies[sessionId].find(p => p.name === name).role;
        socket.emit('sendRole', {role});
    });


    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
        // Clean up on disconnect
        for (const sessionId in io.lobbies) {
            io.lobbies[sessionId] = io.lobbies[sessionId].filter(user => user.id !== socket.id);
            socket.leave(sessionId)
            io.to(sessionId).emit('updateParticipants', io.lobbies[sessionId]);

        }
    });

    socket.on('getParticipants', (sessionId) => {
        socket.emit('updateParticipants', io.lobbies[sessionId]);
        console.log(`${socket.id} requested Participants to ${sessionId}`);
    });



    socket.on('createGame', () => {
        const sessionId = uuidv4();
        socket.join(sessionId);
        io.narrators[sessionId] = socket.id;
        io.to(socket.id).emit('gameCreated', { sessionId });
        console.log(`Game created with session ID: ${sessionId}`);
    });




    function generateSessionId() {
        return uuidv4();
    }

};

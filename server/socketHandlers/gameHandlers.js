
module.exports = (io, socket) => {


    socket.on('startGame', (sessionId) => {
        distributeRoles(io.lobbies[sessionId])
        //debugging
        console.log(io.lobbies[sessionId])
        io.lobbies[sessionId].forEach((user) => {
            if (user.id !== socket.id) {
                socket.to(user.id).emit('gameStarted', user);
                socket.emit('gameStartedForNarrator', io.lobbies[sessionId])
                console.log(user.id);
                console.log(user);
            }
        });
    });

    socket.on('setPhasePlayers', (newPhase) => {
        const sessionId = getSessionId(socket);

        socket.to(sessionId).emit("setPhasePlayers", newPhase)

    });
};


const distributeRoles = (lobbyParticipants) => {
    const numberOfWerewolves = lobbyParticipants.length <= 5 ? 1 : 2;

    // Generate a shuffled list of roles
    const roles = Array(lobbyParticipants.length).fill("Villager");
    for (let i = 0; i < numberOfWerewolves; i++) {
        roles[i] = "Werewolf";
    }
    const shuffledRoles = roles.sort(() => Math.random() - 0.5);

    // Assign roles back to participants in the original order
    lobbyParticipants.forEach((participant, index) => {
        participant.role = shuffledRoles[index];
    });

    // Debugging: log the distributed roles
    console.log("Roles distributed in original order:", lobbyParticipants);
};


const getSessionId = (socket) => {
    // Get the sessionId (assuming it's the first custom room the socket joined)
    for (const room of socket.rooms) {
        if (room !== socket.id) return room; // Skip the default room (socket.id)
    }
    return null;
};
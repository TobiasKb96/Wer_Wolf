
module.exports = (io, socket) => {


    socket.on('startGame', (sessionId) => {
        socket.to(sessionId).emit('startGame')
        distributeRoles(io.lobbies[sessionId])
    });



};

const distributeRoles = (lobbyParticipants) => {
    const numberOfWerewolves = lobbyParticipants.length <= 5 ? 1 : 2;
    const shuffledParticipants = [...lobbyParticipants].sort(() => Math.random() - 0.5);

    // Assign roles
    const updatedParticipants = shuffledParticipants.map((participant, index) => {
        return {
            ...participant,
            role: index < numberOfWerewolves ? "Werewolf" : "Villager"
        };
    });

    // Debugging: log the distributed roles
    console.log("Roles distributed:", updatedParticipants);
}


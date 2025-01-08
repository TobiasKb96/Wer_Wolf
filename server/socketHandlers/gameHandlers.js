
module.exports = (io, socket) => {


    socket.on('startGame', (sessionId) => {
        distributeRoles(io.lobbies[sessionId])
        //debugging
        io.lobbies[sessionId].forEach((user) => {
            if (user.id !== socket.id) {
                socket.to(user.id).emit('gameStarted', user);
                console.log(user.id);
                console.log(user);
            }
        });
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


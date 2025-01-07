
module.exports = (io, socket) => {


    socket.on('startGame', (sessionId) => {
        //distributeRoles(io.lobbies[sessionId])
        const player = io.lobbies[sessionId].find(user => user.id === socket.id)
        console.log(io.lobbies[sessionId])
        console.log(socket.id)
        console.log(io.lobbies[sessionId].find(user => user.id === socket.id))
        console.log(player)
        socket.to(sessionId).emit('startGame', player)
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


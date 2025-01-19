const votes = {};
let totalVotes = 0;
let voterCount = 0;

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

    socket.on('startVoting', ({voters, choices, txtMsg}) => {
        const sessionId = getSessionId(socket);
        const players = io.lobbies[sessionId];
        voterCount = voters.length;
        console.log('voters received', voters, 'victims received', choices);
        if(voters) {
            voters.forEach(voter => {
                socket.to(voter.id).emit('votePrompt', {choices, txtMsg});
            });
        }
        else {
            players.forEach(player => {
                socket.to(player.id).emit('votePrompt');
            });
        }
        console.log('startVoting');
    });


    socket.on('vote', ({ voter, votedFor}) => {
        if (!votes[voter]) {
            votes[voter] = votedFor;
            totalVotes += 1;
            console.log(totalVotes);
            console.log(voter);
            const sessionId = getSessionId(socket);
            const players = io.lobbies[sessionId];

            if (totalVotes ===  voterCount) {
                const voteCounts = {};
                Object.values(votes).forEach(votedFor => {
                    if (!voteCounts[votedFor]) {
                        voteCounts[votedFor] = 0;
                    }
                    voteCounts[votedFor] += 1;
                });
                console.log(voteCounts);

                const mostVotedPlayer = Object.keys(voteCounts).reduce((a, b) => voteCounts[a] > voteCounts[b] ? a : b);
                console.log('mostVotedPlayer', mostVotedPlayer);
                socket.to(io.narrators[sessionId]).emit('voteResult', mostVotedPlayer);

                totalVotes = 0;
                voterCount = 0;
                Object.keys(votes).forEach(key => delete votes[key]);
            }
        }
    });

    socket.on('witchNightAction' , ()=> {
        const sessionId = getSessionId(socket);
        socket.to(sessionId).emit('witchShowPotions');
    });


    //TODO: send Array of recently killed players to Witch
    socket.on('healingPotion' , ()=> {
        const sessionId = getSessionId(socket);
        socket.to(sessionId).emit('useHealingPotion', recentlyKilledPlayers);
    });

    socket.on('poisonPotion' , ()=> {
        const sessionId = getSessionId(socket);
        socket.to(sessionId).emit('usePoisonPotion');
    });

    socket.on('skipPotions' , ()=> {
        const sessionId = getSessionId(socket);
        socket.to(sessionId).emit('skipPotionUse');
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

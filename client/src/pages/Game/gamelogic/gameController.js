import LobbyParticipants from "../../../components/LobbyParticipants.jsx";
import Werewolf from "./roles/Werewolf.js";
import Villager from "./roles/Villager.js";
import Player from "./Player.js";
import Witch from "./roles/Witch.js";
import Bodyguard from "./roles/Bodyguard.js";
import Cupid from "./roles/Cupid.js";
import Hunter from "./roles/Hunter.js";
import Seer from "./roles/Seer.js";
import socket from "../../../utils/socket.js";
import Voting  from "../../../components/voting.jsx";
import Girl from "./roles/Girl.js";



class GameController {
    constructor() {
        this.players = []; // List of players who joined
        this.currentPhase = "day"; // Default is "day"
        this.votes = {}; // Track votes cast by players
        this.sessionId = "";
        this.diedThisNight = [];
        this.nightStep = 0;
        this.protectedPlayer = null;

    }

    // Add a player if they are not already in the list
    addPlayer(player) {
        if (!this.players.some(existingPlayer => existingPlayer.id === player.id)) {
            this.players.push(player);
        }
    }

    // Set the entire list of players
    setPlayers(players) {
        this.players = players;
    }

    // Get the current list of players
    getPlayers() {
        return this.players;
    }

    // Set the current game phase (day/night)
    setPhase(phase) {
        this.currentPhase = phase;
    }

    // Get the current game phase
    getPhase() {
        return this.currentPhase;
    }

    // Record a vote from a voter for a selected player
    castVote(voter, selectedPlayer) {
        this.votes[voter] = selectedPlayer;
    }

    // Reset all votes
    resetVotes() {
        this.votes = {};
    }

    // Get the current session ID
    getSessionID() {
        return this.sessionId;
    }

    // Set the session ID
    setSessionID(id) {
        this.sessionId = id;
    }

    findPlayerById(id) {
        console.log('findPlayerById log:', this.players.find(player => player.id === id))
        return this.players.find(player => player.id === id);
    }

    // Game loop to manage phases and initiate voting
    gameLoop() {
        if (this.currentPhase === 'day') {
            this.setPhase('night');
        } else {
            this.setPhase('day');
        }
    }

    gameLoopTimer() {

    }

    distributeRoles = (lobbyParticipants, selectedRoles) => {
        const numberOfWerewolves = lobbyParticipants.length <= 5 ? 1 : 2;

        // Generate a shuffled list of roles
        const roles = Array.from({ length: lobbyParticipants.length }, () => new Villager());
        for (let i = 0; i < numberOfWerewolves; i++) {
            roles[i] = new Werewolf;
            console.log(Werewolf.roleName);
        }
        console.log(selectedRoles);

        for (let j = 0; j < selectedRoles.length; j++) {
            switch(selectedRoles[j]) {
                case 'Witch':
                    roles[roles.length - j - 1] = new Witch;
                    break;
                case 'Bodyguard':
                    roles[roles.length - j - 1] = new Bodyguard;
                    break;
                case 'Cupid':
                    roles[roles.length - j - 1] = new Cupid;
                    break;
                case 'Hunter':
                    roles[roles.length - j - 1] = new Hunter;
                    break;
                case 'Seer':
                    roles[roles.length - j - 1] = new Seer;
                    break;
                case 'Girl':
                    roles[roles.length - j - 1] = new Girl;
                    break;
            }
        }

        console.log(roles);

        const shuffledRoles = roles.sort(() => Math.random() - 0.5);

        // Assign roles back to participants in the original order
        lobbyParticipants.forEach((participant, index) => {
            participant.role = shuffledRoles[index];
        });


        // Debugging: log the distributed roles
        console.log("Role distributed in original order:", lobbyParticipants);

        for (const player of lobbyParticipants) {
            this.addPlayer(new Player(player.name, player.role, player.id));
        }
        console.log("Players added to gameController:", this.getPlayers());

    };

    getActiveRolesWithNightAction = async() => {
        const activeRoles = await new Promise((resolve) => {
            resolve(this.players
                .filter(player => player.isAlive) // Only include alive players
                .filter(player => player.role.hasNightAction) // Only include roles with night actions
                .filter(player => {
                    // Check if the role has specific conditions like `firstNight`
                    if (player.role.roleName === "Cupid") {
                        return player.role.firstNight === true; // Only include Cupid if it's the first night
                    }
                    return true; // Include other roles without special conditions
                })
                .map(player => player.role) // Extract the role objects
                .sort((a, b) => a.nightPriority  - b.nightPriority )) // Sort by priority
                //.map(role => role.roleName)) // Extract only the role names
        })
        return activeRoles; // Returns array of role names in priority order
    }

    getActivePlayers(){
        return this.players.filter(player => player.isAlive);
    }

    nightPhase = async(activeRole) => {
        let voters = [];
        let choices = [];
        let activePlayers = this.getActivePlayers()
        let votedName = ""
        let votedPlayer = null
        console.log("Night phase started");
        const activeRoles = this.getActiveRolesWithNightAction();

        console.log(activeRoles);
        switch(activeRole) {
            case 'Werewolf':
                voters = activePlayers.filter(player => player.role.roleName === "Werewolf");
                choices = activePlayers.filter(player => player.role.roleName !== "Werewolf");
                votedName= await new Promise((resolve) => {
                    resolve(Werewolf.nightAction(voters, choices));

                });
                votedPlayer = this.players.find(player => player.name === votedName);
                this.diedThisNight.push(votedPlayer)
                //votedPlayer.kill();
                break;

            case 'Cupid':
                voters = activePlayers.filter(player => player.role.roleName === "Cupid");
                choices = activePlayers.filter(player => player.role.roleName !== "Cupid");
                const votedLovers= await new Promise((resolve) => {
                    resolve(Cupid.nightAction(voters, choices));

                });
                console.log("votedLoversArray",votedLovers);
                const lover1 = this.players.find(player => player.name === votedLovers[0]);
                const lover2 = this.players.find(player => player.name === votedLovers[1]);
                console.log("lover1",lover1, "lover2",lover2);
                lover1.role.setLovers()
                lover2.role.setLovers();
                break;
            case 'Bodyguard':
                voters = activePlayers.filter(player => player.role.roleName === "Bodyguard");
                choices = activePlayers.filter(player => player.role.roleName !== "Bodyguard");
                const votedProtected= await new Promise((resolve) => {
                    resolve(Bodyguard.nightAction(voters, choices));
                });
                this.protectedPlayer = this.players.find(player => player.name === votedProtected);
                break;
        }
    }

    dayPhase = async() => {
        console.log("Day phase started");
        const voters = this.getActivePlayers();
        const choices = this.getActivePlayers();
        const txtMsg = "Townsfolk, choose who you want to kill";
        const votedName = await new Promise((resolve) => {
            const handleEvent = (selectedPlayers) => {
                console.log(`Townsfolk chose victim: ${selectedPlayers}`);
                socket.off('voteResult', handleEvent); // Clean up listener
                resolve(selectedPlayers);
            };

            // Register the listener
            socket.on('voteResult', handleEvent);
            socket.emit('startVoting', { voters, choices , txtMsg});
        });
        const votedPlayer = this.players.find(player => player.name === votedName);
        votedPlayer.kill();
        return votedPlayer;
    }

    checkWinCondition = async() => {
        const alivePlayers = this.getActivePlayers(); // Get all alive players
        if (alivePlayers.length === 0) {
            return "NO_WIN"; // No players left, no winner
        }
        const firstGoal = alivePlayers[0].role.goalCondition; // Take the goal of the first alive player

        // Check if all alive players have the same goal
        const allSameGoal = alivePlayers.every(player => player.role.goalCondition === firstGoal);

        if (allSameGoal) {
            return firstGoal; // All alive players have the same goal, return it
        }

        return "NO_WIN"; // Not all alive players have the same goal
    }
}

export default new GameController();

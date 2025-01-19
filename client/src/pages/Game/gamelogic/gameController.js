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

    distributeRoles = (lobbyParticipants, selectedRoles) => {
        const numberOfWerewolves = lobbyParticipants.length <= 5 ? 1 : 2;

        // Generate a shuffled list of roles
        const roles = Array(lobbyParticipants.length).fill(new Villager);
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

    nightPhase = () => {
        let voters = [];
        let choices = [];
        let activePlayers = this.players.filter(player => player.isAlive);
        console.log("Night phase started");
        const activeRoles =  Array.from(
            new Map(
                this.players
                    .filter(player => player.isAlive) // Filter players who are alive
                    .map(player => [player.role.roleName, player.role]) // Map to a [roleName, roleObject] pair
            ).values() // Use a Map to ensure uniqueness by role name
        );

        console.log(activeRoles);
        /*
        if(activeRoles.some(role => role.roleName === "Cupid")) {
            let voters = this.players.filter(player => player.role.roleName === "Cupid");
            let choices = this.players.filter(player => player.role.roleName !== "Cupid");
            const lovers = Cupid.nightAction(voters, choices);
            while(lovers.length < 2) {
                console.log("waiting for lovers");
            }
        }
        */

        if(activeRoles.some(role => role.roleName === "Werewolf")) {
            let voters = activePlayers.filter(player => player.role.roleName === "Werewolf");
            let choices = activePlayers.filter(player => player.role.roleName !== "Werewolf");
            const votedName = Werewolf.nightAction(voters, choices);
            const votedPlayer = this.players.find(player => player.name === votedName);
            console.log(votedPlayer);
            this.diedThisNight.push(votedPlayer);
        }
        /*
        //end of night
        for (const player of this.diedThisNight) {
            player.kill();
        }
        */

    }
}

export default new GameController();

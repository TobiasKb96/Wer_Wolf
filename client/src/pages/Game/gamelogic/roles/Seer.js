import Role from "../Role.js";
import game from "../../game.jsx";
import Voting from "../../../../components/voting.jsx";
import socket from "../../../../utils/socket.js";
import seerImg from "../../../../assets/seer.jpg";


class Seer extends Role{

    constructor() {
        super('Seer', true);
        this.description = 'You are the Seer. You may choose one player each night whos role is going to be revealed to you.'
        this.goal = `Your goal is to win with the townsfolk`
        this.goalCondition = "Townsfolk"
        this.roleImg = seerImg
        this.nightPriority  = 5;
        this.scriptstart = "Seer, open your eyes and choose a player to reveal their role."
        this.scriptend = "Seer, close your eyes."
    }

    static async nightAction(voters, choices)
    {
        console.log("Seer night action started");
        const txtMsg = "Choose whose role to reveal";
        // Create a promise that resolves when the event happens
        const playerToReveal= await new Promise((resolve) => {

            const handleEvent = (selectedPlayers) => {
                console.log(`Seer chooses a player to reveal: ${selectedPlayers}`);
                socket.off('voteResult', handleEvent); // Clean up listener
                socket.emit('revealRole', selectedPlayers, voters);
                resolve(selectedPlayers);
            };

            // Register the listener
            socket.on('voteResult', handleEvent);
            socket.emit('startVoting', { voters, choices , txtMsg});
        });
        return playerToReveal;
    }
}


export default Seer;
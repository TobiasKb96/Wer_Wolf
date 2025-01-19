import Role from "../Role.js";
import Voting from "../../../../components/voting.jsx";
import socket from "../../../../utils/socket.js";
import werewolfImg from '../../../../assets/werewolf1.jpeg';

class Werewolf extends Role{

    constructor()
    {
        super('Werewolf', true, 'Werewolf');
        this.priority = 1;
        this.description = 'You are a werewolf. You and your pack can vote in the night to eliminate another player'
        this.goal = `Your goal is to eliminate the townsfolk`
        this.goalCondition = "Werewolves"
        this.roleImg = werewolfImg
        this.scriptstart ="Werewolves awake now and open your eyes."
        this.scriptend = "Werewolves, close your eyes."
        this.prioriy = 3;
    }

    static async nightAction(voters, choices)
    {
        console.log("Werewolfs night action started");
        const txtMsg = "Choose who to kill";
        // Create a promise that resolves when the event happens
        const playerToKill= await new Promise((resolve) => {

            const handleEvent = (selectedPlayers) => {
                console.log(`Werewolvess chose victim: ${selectedPlayers}`);
                socket.off('voteResult', handleEvent); // Clean up listener
                resolve(selectedPlayers);
            };

            // Register the listener
            socket.on('voteResult', handleEvent);
            socket.emit('startVoting', { voters, choices , txtMsg});
        });
        return playerToKill;
    }
}

export default Werewolf;
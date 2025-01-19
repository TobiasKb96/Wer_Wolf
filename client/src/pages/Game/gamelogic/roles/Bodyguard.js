import Role from "../Role.js";
import socket from "../../../../utils/socket.js";
import bodyguardImg from "../../../../assets/werewolf1.jpeg";


class Bodyguard extends Role{

    constructor() {
        super('Bodyguard', true);
        this.description = 'You are the Bodyguard. You may choose one person to protect each night. This player cannot die that die.'
        this.goal = `Your goal is to win with the townsfolk`
        this.goalCondition = "Townsfolk"
        this.nightPriority = 1;
        this.roleImg = bodyguardImg

        this.scriptstart ="Bodyguard awake now and open your eyes."
        this.scriptend = "Bodyguard, close your eyes."
    }


    static async nightAction(voters, choices)
    {
        console.log("Bodyguard night action started");
        const txtMsg = "Choose who to protect";
        // Create a promise that resolves when the event happens
        const playerToProtect= await new Promise((resolve) => {

            const handleEvent = (selectedPlayers) => {
                console.log(`Bodyguard chooses a player to protect: ${selectedPlayers}`);
                socket.off('voteResult', handleEvent); // Clean up listener
                resolve(selectedPlayers);
            };

            // Register the listener
            socket.on('voteResult', handleEvent);
            socket.emit('startVoting', { voters, choices , txtMsg});
        });
        return playerToProtect;
    }


}


export default Bodyguard;
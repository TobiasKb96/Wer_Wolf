import Role from "../Role.js";
import socket from "../../../../utils/socket.js";
import Voting from "../../../../components/voting.jsx";
import {Socket} from "socket.io-client";
import witchImg from "../../../../assets/witch.jpeg";


class Witch extends Role{

    constructor() {
        super('Witch', true);
        this.description = 'You are the Witch. You own a poison potion which kills and a healing potion which revives. You may use each once in the game. Choose wisely.'
        this.goal = `Your goal is to win with the townsfolk`
        this.goalCondition = "Townsfolk"
        this.hasPoisonPotion = true;
        this.hasRevivePotion = true;
        this.nightPriority  = 4;
        this.roleImg = witchImg
        this.scriptstart ="Witch awake now and open your eyes."
        this.scriptend = "Witch, close your eyes."
    }


    nightAction(voters, choices) {
        console.log("Night Action Witch");
        if(this.hasRevivePotion || this.hasPoisonPotion) {
            socket.emit('witchNightAction');
            console.log("witch has potions")
        }

        socket.on('usePoisonPotion' , ()=> {
            const txtMsg = 'Choose who to kill';
            socket.emit('startVoting', { voters, choices , txtMsg});
            this.hasPoisonPotion = false;
        });

        socket.on('useHealingPotion' , (recentlyKilledPlayers)=> {
            const choices = recentlyKilledPlayers;
            const txtMsg = 'Choose who to save';
            socket.emit('startVoting', { voters, choices , txtMsg});
            this.hasRevivePotion = false;
        });

        socket.on('skipPotionUse' , ()=> {
            return;
        });

    }


}


export default Witch;
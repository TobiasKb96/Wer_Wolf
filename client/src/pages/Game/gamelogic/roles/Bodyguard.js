import Role from "../Role.js";
import socket from "../../../../utils/socket.js";
import bodyguardImg from "../../../../assets/werewolf1.jpeg";


class Bodyguard extends Role{

    constructor() {
        super('Bodyguard', true);
        this.description = 'You are the Bodyguard. You may choose one person to protect each night. This player cannot die that die.'
        this.goal = `Your goal is to win with the townsfolk`
        this.goalCondition = "Townsfolk"
        this.priority = 1;
        this.roleImg = bodyguardImg

        this.scriptstart ="Bodyguard awake now and open your eyes."
        this.scriptend = "Bodyguard, close your eyes."
    }


    nightAction(voters, choices) {
        const txtMsg = 'Choose who to protect';
        socket.emit('startVoting', { voters, choices , txtMsg});
    }


}


export default Bodyguard;
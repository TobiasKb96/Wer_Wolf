import Role from "../Role.js";
import socket from "../../../../utils/socket.js";


class Bodyguard extends Role{

    constructor() {
        super('Bodyguard', true);
        this.description = 'You are the Bodyguard. You may choose one person to protect each night. This player cannot die that die.'
        this.goal = `Your goal is to win with the townsfolk`
    }


    nightAction(voters, choices) {
        const txtMsg = 'Choose who to protect';
        socket.emit('startVoting', { voters, choices , txtMsg});
    }


}


export default Bodyguard;
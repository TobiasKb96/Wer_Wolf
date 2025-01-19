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
        this.roleImg = seerImg
        this.priority = 5;
        this.scriptstart = "Seer, open your eyes. Cupid chooses two players to be in love."
        this.scriptend = "Seer, close your eyes."
    }


    nightAction(voters, choices) {
        const txtMsg = 'Choose whose role to reveal';
        socket.emit('startVoting', { voters, choices , txtMsg});
    }


}


export default Seer;
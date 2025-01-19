import Role from "../Role.js";
import Voting from "../../../../components/voting.jsx";
import socket from "../../../../utils/socket.js";
//import werewolfImg from '../../../../assets/werewolf1.jpeg';

class Werewolf extends Role{

    constructor()
    {
        super('Werewolf', true, 'Werewolf');
        this.priority = 1;
        this.description = 'You are a werewolf. You and your pack can vote in the night to eliminate another player'
        this.goal = `Your goal is to eliminate the townsfolk`
      //  this.roleImg = werewolfImg
    }

    nightAction(voters, choices)
    {
        const txtMsg = 'Choose who to kill';
        socket.emit('startVoting', { voters, choices , txtMsg});
    }
}

export default Werewolf;
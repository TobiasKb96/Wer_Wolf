import Role from "../Role.js";
import Voting from "../../../../components/voting.jsx";
import socket from "../../../../utils/socket.js";
import werewolfImg from "../../../../assets/werewolf1.jpeg";


class Cupid extends Role{

    constructor() {
        super('Cupid', true);
        this.description = 'You are the Cupid. In the first night you may select to players to be lovers. If one of them dies, the other dies of a broken heart.'
        this.goal = `Your goal is to win with the townsfolk`
        this.roleImg = werewolfImg
        this.scriptstart = "Cupid, open your eyes. Cupid chooses two players to be in love."
        this.scriptend = "Cupid, close your eyes."
        this.firstNight = true;
    }


    static nightAction(voters, choices) {
        const lovers = [];
        const txtMsg = 'Choose who you want to be lovers, you get two separate votes';
        let voteCount = 0;

        socket.on('voteResult', (mostVotedPlayer) => {
            if(voteCount === 0) {
                lovers.push(mostVotedPlayer);
                voteCount++;
                socket.emit('startVoting', { voters, choices , txtMsg});
            }
            else if(voteCount === 1) {
                lovers.push(mostVotedPlayer);
                voteCount++;
            }
        });

        socket.emit('startVoting', { voters, choices , txtMsg});

        while(voteCount < 2) {

        }

    return lovers;

    }


}


export default Cupid;
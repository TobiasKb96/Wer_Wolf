import Role from "../Role.js";
import Voting from "../../../../components/voting.jsx";
import socket from "../../../../utils/socket.js";
import cupidImg from "../../../../assets/cupid.jpeg";


class Cupid extends Role{

    constructor() {
        super('Cupid', true);
        this.description = 'You are the Cupid. In the first night you may select to players to be lovers. If one of them dies, the other dies of a broken heart.'
        this.goal = `Your goal is to win with the townsfolk`
        this.goalCondition = "Townsfolk"
        this.roleImg = cupidImg
        this.scriptstart = "Cupid, open your eyes. Cupid chooses two players to be in love."
        this.scriptend = "Cupid, close your eyes."
        this.firstNight = true;
        this.nightPriority  = 2;
    }


    static async nightAction(voters, choices) {
        const lovers = [];
        const txtMsg = 'Choose who you want to be lovers, you get two separate votes';

        const playerToLovers= await new Promise((resolve) => {

            const handleEvent = (selectedPlayers) => {
                if(lovers.length === 0) {
                    console.log(`Cupid chose Lover: ${selectedPlayers}`);
                    lovers.push(selectedPlayers);
                    choices = choices.filter(player => player.name !== selectedPlayers);
                    socket.emit('startVoting', { voters, choices , txtMsg});
                }
                else if(lovers.length === 1) {
                    console.log(`Cupid chose Lover: ${selectedPlayers}`);
                    resolve(selectedPlayers);
                    lovers.push(selectedPlayers);
                    socket.off('voteResult', handleEvent);
                }
            }
            // Register the listener
            socket.on('voteResult', handleEvent);
            socket.emit('startVoting', { voters, choices , txtMsg});
        });
        this.firstNight = false;
        return lovers;

    }


}


export default Cupid;
import Role from "../Role.js";
import game from "../../game.jsx";
import Voting from "../../../../components/voting.jsx";


class Seer extends Role{

    constructor() {
        super('Seer', true);
        this.description = 'You are the Seer. You may choose one player each night whos role is going to be revealed to you.'
        this.goal = `Your goal is to win with the townsfolk`
    }


    nightAction(seer, playerSelection) {
        Voting(seer, playerSelection, true);
    }


}


export default Seer;
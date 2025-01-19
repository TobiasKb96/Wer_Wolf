import Role from "../Role.js";
import game from "../../game.jsx";


class Girl extends Role{

    constructor() {
        super('Girl', false);
        this.description = 'You are the Girl. At night, you may peek (open your eyes secretly) to see what happens at night.'
        this.goal = `Your goal is to win with the townsfolk`
    }



}


export default Girl;
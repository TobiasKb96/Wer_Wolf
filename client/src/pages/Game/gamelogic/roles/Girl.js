import Role from "../Role.js";
import game from "../../game.jsx";
import girlImg from "../../../../assets/girl.jpg";


class Girl extends Role{

    constructor() {
        super('Girl', false);
        this.description = 'You are the Girl. At night, you may peek (open your eyes secretly) to see what happens at night.'
        this.goal = `Your goal is to win with the townsfolk`
        this.goalCondition = "Townsfolk"
        this.roleImg = girlImg;
    }



}


export default Girl;
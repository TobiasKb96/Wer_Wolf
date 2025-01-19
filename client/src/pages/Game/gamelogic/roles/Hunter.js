import Role from "../Role.js";
import hunterImg from "../../../../assets/hunter.jpeg";


class Hunter extends Role{

    //TODO: Hunter action????

    constructor() {
        super('Hunter', false);
        this.description = 'You are the Hunter. When you die, you may take a person of your choice with you.'
        this.goal = `Your goal is to win with the townsfolk`
        this.goalCondition = "Townsfolk"
        this.roleImg = hunterImg
        this.scriptstart ="Hunter awake now and open your eyes."
        this.scriptend = "Hunter, close your eyes."
        this.prioriy = 6;
    }


}


export default Hunter;
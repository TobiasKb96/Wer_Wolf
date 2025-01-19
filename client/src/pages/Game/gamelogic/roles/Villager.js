import Role from "../Role.js";
import villagerImg from "../../../../assets/villager.jpg";

class Villager extends Role{

    constructor() {
        super('Villager', false);
        this.description = 'You do not have any special powers'
        this.goal = `Your goal is to win with the townsfolk`
        this.goalCondition = "Townsfolk"
        this.roleImg = villagerImg

    }

}

export default Villager;
import Roles from "../Roles.js";

class Villager extends Roles{

    constructor() {
        super('Villager', false);
    }

    action(player) {

    }
}

export default Villager;
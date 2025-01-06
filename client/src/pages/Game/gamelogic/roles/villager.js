import Roles from "../Roles.js";

class Villager extends Roles{

    constructor() {
        super('Villager', false);
    }

    nightAction(player) {

    }
}

export default Villager;
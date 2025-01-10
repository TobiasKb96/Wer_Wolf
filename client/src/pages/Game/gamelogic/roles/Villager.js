import Role from "../Role.js";

class Villager extends Role{

    constructor() {
        super('Villager', false);
    }

    nightAction(player) {

    }
}

export default Villager;
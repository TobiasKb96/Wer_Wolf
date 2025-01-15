import Role from "../Role.js";

class Villager extends Role{

    constructor() {
        super('Villager', false);
        this.description = 'You do not have any special powers'
        this.goal = `Your goal is to win with the townsfolk`
    }

    nightAction(player) {

    }
}

export default Villager;
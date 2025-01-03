import Roles from "../Roles.js";

class Werewolf extends Roles{

    constructor()
    {
        super('Werewolf', false); // Villager has no night action
    }

    action(player)
    {
        console.log(`${this.name} cannot perform any night action.`);
    }
}

export default Werewolf;
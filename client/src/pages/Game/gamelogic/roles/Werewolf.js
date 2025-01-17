import Role from "../Role.js";

class Werewolf extends Role{

    constructor()
    {
        super('Werewolf', true, 'Werewolf');
        this.priority = 1;
    }

    nightAction(player)
    {
    }
}

export default Werewolf;
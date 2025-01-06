import Roles from "../Roles.js";

class Werewolf extends Roles{

    constructor()
    {
        super('Werewolf', true);
    }

    nightAction(player)
    {
    }
}

export default Werewolf;
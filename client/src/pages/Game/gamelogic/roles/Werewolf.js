import Role from "../Role.js";

class Werewolf extends Role{

    constructor()
    {
        super('Werewolf', true);
        this.priority = 1;
        this.description = 'You and your pack can vote in the night to eliminate another player'
        this.goal = `Your goal is to eliminate the townsfolk`
    }

    nightAction(player)
    {
    }
}

export default Werewolf;
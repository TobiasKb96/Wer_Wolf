import Role from "../Role.js";

class Werewolf extends Role{

    constructor()
    {
        super('Werewolf', true, 'Werewolf');
        this.priority = 1;
        this.description = 'You are a werewolf. You and your pack can vote in the night to eliminate another player'
        this.goal = `Your goal is to eliminate the townsfolk`
    }

    nightAction(werewolves, playerSelection)
    {
        //TODO: start voting for werewolves
    }
}

export default Werewolf;
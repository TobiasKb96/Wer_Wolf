import Role from "../Role.js";
import werewolfImg from '../../../../assets/werewolf1.jpeg';

class Werewolf extends Role{

    constructor()
    {
        super('Werewolf', true, 'Werewolf');
        this.priority = 1;
        this.description = 'You and your pack can vote in the night to eliminate another player'
        this.goal = `Your goal is to eliminate the townsfolk`
        this.roleImg = werewolfImg
    }

    nightAction(player)
    {
    }
}

export default Werewolf;
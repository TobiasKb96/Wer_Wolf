import Role from "../Role.js";


class Cupid extends Role{

    constructor() {
        super('Cupid', true);
        this.description = 'You are the Cupid. In the first night you may select to players to be lovers. If one of them dies, the other dies of a broken heart.'
        this.goal = `Your goal is to win with the townsfolk`
    }


    nightAction(cupid, playerSelection) {
        //TODO: voting choose person
    }


}


export default Cupid;
import Role from "../Role.js";


class Bodyguard extends Role{

    constructor() {
        super('Bodyguard', true);
        this.description = 'You are the Bodyguard. You may choose one person to protect each night. This player cannot die that die.'
        this.goal = `Your goal is to win with the townsfolk`
    }


    nightAction(bodyguard, playerSelection) {
        //TODO: call voting for playerSelection

    }


}


export default Bodyguard;
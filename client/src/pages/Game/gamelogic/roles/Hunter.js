import Role from "../Role.js";


class Hunter extends Role{

    //TODO: Hunter action????

    constructor() {
        super('Hunter', false);
        this.description = 'You are the Hunter. When you die, you may take a person of your choice with you.'
        this.goal = `Your goal is to win with the townsfolk`
    }


}


export default Hunter;
import Role from "../Role.js";


class Seer extends Role{

    constructor() {
        super('Seer', true);
        this.hasPotion = true;
    }


    nightAction() {

    }


}


export default Seer;
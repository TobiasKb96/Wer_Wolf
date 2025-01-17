import Role from "../Role.js";


class Bodyguard extends Role{

    constructor() {
        super('Bodyguard', true);
        this.hasPotion = true;
    }


    nightAction() {

    }


}


export default Bodyguard;
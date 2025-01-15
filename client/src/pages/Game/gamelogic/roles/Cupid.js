import Villager from "./Villager.js";


class Cupid extends Villager{

    constructor() {
        super('Cupid', true);
    }


    nightAction() {

    }


}
Villager.registerSubclass(new Cupid());

export default Cupid;
import Villager from "./Villager.js";


class Witch extends Villager{

    constructor() {
        super('Witch', true);
        this.hasPotion = true;
    }


    nightAction() {

    }


}
Villager.registerSubclass(new Witch());

export default Witch;
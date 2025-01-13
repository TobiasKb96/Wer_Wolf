import Role from "../Role.js";

class Villager extends Role{

    static subclasses = [];

    constructor() {
        super('Villager', false);
    }

    nightAction() {

    }

    static getSubclasses(){
        return Villager.subclasses;
    }

    static registerSubclass(subclass){
        Villager.subclasses.push(subclass);
    }


}

export default Villager;
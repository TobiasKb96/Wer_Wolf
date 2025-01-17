import Role from "../Role.js";

class Villager extends Role{

    static subclasses = [];

    constructor() {
        super('Villager', false, 'Villager');
        this.description = 'You do not have any special powers'
        this.goal = `Your goal is to win with the townsfolk`
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
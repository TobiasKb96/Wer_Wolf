import Role from "../Role.js";
import socket from "../../../../utils/socket.js";


class Witch extends Role{

    constructor() {
        super('Witch', true);
        this.description = 'You are the Witch. You own a poison potion which kills and a healing potion which revives. You may use each once in the game. Choose wisely.'
        this.goal = `Your goal is to win with the townsfolk`
        this.hasPoisonPotion = true;
        this.hasRevivePotion = true;
    }


    nightAction() {
        console.log("Night Action Witch");
        if(this.hasRevivePotion || this.hasPoisonPotion) {
            socket.emit('witchNightAction');
            console.log("witch has potions")
        }

        socket.on('usePoisonPotion' , ()=> {
            //TODO start voting for who to kill
            this.hasPoisonPotion = false;
        });

        socket.on('useHealingPotion' , ()=> {
            //TODO start voting for who to heal
            this.hasRevivePotion = false;
        });

    }


}


export default Witch;
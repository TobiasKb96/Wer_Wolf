import {bool} from "prop-types";

class Role {

    constructor (roleName, hasNightAction, goal, roleDescription, roleImg) {
        this.roleName = roleName;
        this.hasNightAction = hasNightAction;
        this.roleDescription = roleDescription //card input
        this.goal = goal; //for checking win conditions and displaying on card
        this.roleImg = roleImg; //for displaying on card
    }

    static nightAction() {
    }

    setLovers() {
        this.goalCondition = "Lovers"
        this.goal = "Your goal is to be the last two players alive with your lover"
    }



}
    export default Role;
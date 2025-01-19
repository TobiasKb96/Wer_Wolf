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

    static setLovers() {
        this.goal = "Lovers"
    }



}
    export default Role;
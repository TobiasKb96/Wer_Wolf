import {bool} from "prop-types";

class Role {

    constructor (roleName, hasNightAction, goal, roleDescription) {
        this.roleName = roleName;
        this.hasNightAction = hasNightAction;
        this.roleDescription = roleDescription //card input
        this.goal = goal; //for checking win conditions and displaying on card
    }

    static nightAction() {
    }



}
    export default Role;
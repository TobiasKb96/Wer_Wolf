import Role from "./Role.js";

class Player {

    constructor(name,role,id) {
        this.name = name;
        this.role = role;
        this.id = id;
        this.isAlive = true;
    }

    assignRole(role) {
        this.role = role;
    }

    kill() {
        this.isAlive = false;
    }

}
    export default Player;
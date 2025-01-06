class Player {

    constructor(name) {
        this.name = name;
        this.role = null;
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
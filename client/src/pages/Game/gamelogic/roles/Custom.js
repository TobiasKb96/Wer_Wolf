import Role from "../Role.js";

class Custom extends Role{

    constructor(customRoleName,roleDescription) {
        super();
        this.roleName = customRoleName;
        this.description = 'You do not have any special powers. ' + roleDescription
        this.goal = `Your goal is to win with the ${customRoleName}`
        this.goalCondition = customRoleName
    }

}

export default Custom;
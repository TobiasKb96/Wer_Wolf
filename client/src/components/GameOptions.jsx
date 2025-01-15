import { useState } from 'react';
import Villager from "../pages/Game/gamelogic/roles/Villager.js";
import Witch from "../pages/Game/gamelogic/roles/Witch.js";
import Cupid from "../pages/Game/gamelogic/roles/Cupid.js";

const GameOptions = ({setSelectedRoles}) => {
    const availableRoles = Villager.getSubclasses();

    console.log("Available Roles: ", availableRoles)
    // Toggle roles in the array
    const handleRoleChange = (role) => {
        console.log("This is activated");
        console.log(role.roleName);
        setSelectedRoles((prevRoles) =>
            prevRoles.includes(role)
                ? prevRoles.filter((r) => r !== role)  // Remove if already selected
                : [...prevRoles, role]
        );
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-80 p-6 bg-white border border-gray-300 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center mb-4">Game Options</h1>

                <h2 className="text-lg font-semibold mb-2">Roles:</h2>

                <div className="flex flex-col space-y-2">
                    {availableRoles.map((role) => (
                        <label key={role} className="flex items-center">
                            <input
                                type="checkbox"
                                onChange={() => handleRoleChange(role)}
                                className="mr-2"
                            />
                            {role.roleName}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GameOptions;

import { useState } from 'react';


const GameOptions = ({setSelectedRoles, setNarrator}) => {
    const [showCustomFields, setShowCustomFields] = useState(false);
    const [disableCustomRole, setDisableCustomRole] = useState(false);
    const [customCharacter, setCustomCharacter] = useState({
        roleName: '',
        roleDescription: '',
        count: '',
    });
    const availableRoles = ['Witch', 'Cupid', 'Bodyguard', 'Seer', 'Hunter', 'Girl'];

    // Toggle roles in the array
    const handleRoleChange = (role) => {
        console.log(role);
        setSelectedRoles((prevRoles) =>
            prevRoles.includes(role)
                ? prevRoles.filter((r) => r !== role)  // Remove if already selected
                : [...prevRoles, role]
        );
    };

    const handleNarratorToggle = () => {
        setNarrator((prev) => !prev); // Toggle narrator

    }

    const handleCustomRoleToggle = () => {
        setShowCustomFields((prev) => !prev); // Toggle visibility of custom fields
    };
    const handleCustomInputChange = (e) => {
        const { name, value } = e.target;
        setCustomCharacter((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleAddCustomRole = () => {
        console.log('Custom Role Added:', customCharacter);
        setSelectedRoles((prevRoles) => [...prevRoles, customCharacter]); // Add custom role to selected roles
        setDisableCustomRole(true)
    };

    return (
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
                        {role}
                    </label>
                ))}
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        onChange={handleNarratorToggle} // Toggle custom fields visibility
                        className="mr-2 disabled:bg-gray-400"
                    />
                    Play without Narrator
                </label>
                <label className="flex items-center">
                    <input
                        disabled={disableCustomRole}
                        type="checkbox"
                        onChange={handleCustomRoleToggle} // Toggle custom fields visibility
                        className="mr-2 disabled:bg-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed"
                    />
                    Custom
                </label>
            </div>
            {showCustomFields && ( // Conditionally render custom input fields
                <div>
                    <h2 className="text-lg font-semibold mb-2">Add your own character:</h2>
                    <input
                        disabled={disableCustomRole}
                        type="text"
                        name="roleName"
                        placeholder="Character name"
                        value={customCharacter.roleName}
                        onChange={handleCustomInputChange}
                        className="border border-gray-300 rounded px-4 py-2 mb-4 text-black w-full disabled:bg-gray-200 disabled:text-gray-600 disabled:cursor-not-allowed"
                    />
                    <input
                        disabled={disableCustomRole}
                        type="text"
                        name="roleDescription"
                        placeholder="Character Description"
                        value={customCharacter.roleDescription}
                        onChange={handleCustomInputChange}
                        className="border border-gray-300 rounded px-4 py-2 mb-4 text-black w-full disabled:bg-gray-200 disabled:text-gray-600 disabled:cursor-not-allowed"
                    />
                    <input
                        disabled={disableCustomRole}
                        type="text"
                        name="count"
                        placeholder="How many characters"
                        value={customCharacter.count}
                        onChange={handleCustomInputChange}
                        className="border border-gray-300 rounded px-4 py-2 mb-4 text-black w-full disabled:bg-gray-200 disabled:text-gray-600 disabled:cursor-not-allowed"
                    />
                    <button
                        disabled={disableCustomRole}
                        onClick={handleAddCustomRole}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-600 disabled:cursor-not-allowed"
                    >
                        Add Custom Role
                    </button>

                </div>
            )}
        </div>
    );
};

export default GameOptions;

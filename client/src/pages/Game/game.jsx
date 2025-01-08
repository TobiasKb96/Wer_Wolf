import Join from "../Join/join.jsx";
import {useState, useEffect} from "react";
import adapter from 'webrtc-adapter';


//TODO Anna

//TODO show your own role, (all players that are not the narrator, are on this page)
//TODO should: show timers, inform player if he died, allow players to choose a player to chat to during daytime (insert chat component)

//TODO use player from parent
//TODO M5. The system shall provide 2 playable characters, werewolf.js and villager -> works?
//TODO M6. The system shall manage game phases to differentiate between day and night.
//TODO M7. The system shall provide the narrator with an overview of the characters of the players.
//TODO M8.	The system shall display the narrator’s script, including all necessary prompts and instructions, on the narrator’s device.

function Game({player}){
    const [isNight] = useState(false);

    useEffect(() => {
        console.log(player)

        if (!player.isAlive) {
            alert("You have died!");
        }
    }, [player.isAlive]);

    const handleShowRole = () => {
        alert(`Your role is: ${player?.role}`);
    };

    return (
        <div
            className={`flex items-center justify-center h-screen ${isNight ? "bg-black text-white" : "bg-gray-100 text-black"}`}
        >
            <div>
                <h1 className="text-3xl font-bold mb-4">
                    {isNight ? "It's night. You're asleep." : "It's daytime. Wake up!"}
                </h1>
                    <button
                        onClick={handleShowRole}
                        className="px-6 py-3 text-lg text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
                    >
                        Show Role
                    </button>
                </div>
        </div>
    );
}

export default Game;
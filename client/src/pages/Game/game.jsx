import Join from "../Join/join.jsx";
import {useState, useEffect} from "react";
import io from "socket.io-client";
import gameState from "./gamelogic/gameState.js";
import LobbyParticipants from "../../components/LobbyParticipants.jsx";


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

    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState("");

    useEffect(() => {
        console.log("Player object handed over:",player)


    if (!player.isAlive) {
            alert("You have died!");
        }
    }, [player.isAlive]);

    const handleShowRole = () => {
        alert(`Your role is: ${player?.role}`);
    };

    const handleVoteClick = () => {
        if (showDropdown && selectedPlayer) {
            // Send vote to gameState
            gameState.castVote(name, selectedPlayer);
            alert(`${name} has voted for ${selectedPlayer}`);
            setShowDropdown(false);
        } else {
            setShowDropdown(true);
        }
    };
    return (
        <div
            className={`flex flex-col items-center justify-center min-h-screen transition-colors ${
                gameState.getPhase() === "day" ? "bg-white text-black" : "bg-gray-900 text-white"
            }`}
        >
            <h1 className="text-4xl font-bold mb-8">
                {gameState.getPhase()}!
            </h1>

            {showDropdown && (
                <select
                    value={selectedPlayer}
                    onChange={(e) => setSelectedPlayer(e.target.value)}
                    className="border border-gray-300 rounded px-4 py-2 mb-4 text-black"
                >
                    <option value="" disabled>
                        Select a player
                    </option>
                    {gameState.getPlayers()
                        .filter((player) => player.name !== name) // Exclude self
                        .map((player) => (
                            <option key={player.name} value={player.name}>
                                <LobbyParticipants sessionId={name}/>
                            </option>
                        ))}
                </select>
            )}

            <button
                onClick={handleVoteClick}
                className="px-6 py-3 text-lg text-white bg-blue-600 rounded-md transition-colors hover:bg-blue-700"
            >
                {showDropdown ? "Send Vote" : "Vote"}
            </button>

            <button
                onClick={handleShowRole}
                className="px-6 py-3 text-lg text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
            >
                Show Role
            </button>

        </div>
    );

}

export default Game;
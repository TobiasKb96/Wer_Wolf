import Join from "../Join/join.jsx";
import {useState, useEffect} from "react";
import io from "socket.io-client";
import gameState from "./gamelogic/gameState.js";
import LobbyParticipants from "../../components/LobbyParticipants.jsx";
import PlayerOverview from "../../components/playerOverview.jsx";


//TODO add sessionID


//TODO should: show timers, inform player if he died, allow players to choose a player to chat to during daytime (insert chat component)

//TODO M5. The system shall provide 2 playable characters, werewolf.js and villager -> playable debateable -> voting ?

function Game({player}){

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

            {<div><PlayerOverview
                        sessionId={'1234'}
                        player={player}/></div>}
        </div>
    );

}

export default Game;
import { useState, useEffect } from "react";
import gameState from "./gamelogic/gameState.js";
import LobbyParticipants from "../../components/LobbyParticipants.jsx";
import io from "socket.io-client";

//TODO Steffi

//TODO show names of all participants and their roles
//TODO provide instructions for phases
//TODO provide buttons to transition phases/end game
//TODO should: provide timers, Narrator has option to kill players (this allows to keep track of who is alive, so the script changes accordingly)

const Narrator = () => {
    const [players, setPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState("");
    const [currentPhase, setCurrentPhase] = useState(gameState.getPhase());
    //const [sessionId, setSessionId] = useState("");

    useEffect(() => {
        setPlayers(gameState.getPlayers());
    }, []);

    const handlePlayerSelect = (event) => {
        setSelectedPlayer(event.target.value);
    };

    const handleSubmit = () => {
        if (selectedPlayer) {
            alert(`${selectedPlayer} has been selected.`);
        }
    };

    const togglePhase = () => {
        const newPhase = currentPhase === "day" ? "night" : "day";
        gameState.setPhase(newPhase);
        setCurrentPhase(newPhase);
    };

    /*const confirmedSessionId = response.data.sessionId;
    setSessionId(confirmedSessionId);*/

    return (
        <div
            className={`flex flex-col items-center p-6 transition duration-500 ${
                currentPhase === "day" ? "bg-white text-black" : "bg-gray-800 text-white"
            }`}
        >
            <h2 className="text-2xl font-bold mb-4">
                {currentPhase === "day" ? "Day Phase" : "Night Phase"}
            </h2>

            <div className="mb-4">
                <label htmlFor="player-select" className="block text-lg font-medium mb-2">
                    Choose a player to kill:
                </label>
                <select
                    id="player-select"
                    value={selectedPlayer}
                    onChange={handlePlayerSelect}
                    className="border border-gray-300 rounded px-4 py-2 w-64 text-black"
                >
                    <option value="" disabled>
                        <LobbyParticipants sessionId={sessionId} />
                    </option>
                    {players.map((player) => (
                        <option key={player} value={player}>
                            {player}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex space-x-4">
                <button
                    onClick={handleSubmit}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                >
                    Notify Narrator
                </button>

                <button
                    onClick={togglePhase}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
                >
                    Switch to {currentPhase === "day" ? "Night" : "Day"}
                </button>
            </div>
        </div>
    );
}

export default Narrator;


import { useState, useEffect } from "react";
import gameState from "../Game/gamelogic/gameState.js";

//TODO show names of all participants and their roles
//TODO provide instructions for phases
//TODO provide buttons to transition phases/end game
//TODO should: provide timers, Narrator has option to kill players (this allows to keep track of who is alive, so the script changes accordingly)


const Narrator = () => {
    const [votes, setVotes] = useState({});
    const [currentPhase, setCurrentPhase] = useState(gameState.getPhase());


    useEffect(() => {
        setVotes({ ...gameState.votes }); // Sync votes with gameState
    }, [gameState.votes]);

    const togglePhase = () => {
        const newPhase = currentPhase === "day" ? "night" : "day";
        gameState.setPhase(newPhase);
        setCurrentPhase(newPhase);
    };

    return (
        <div
            className={`flex flex-col items-center justify-center min-h-screen transition-colors ${
                gameState.getPhase() === "day" ? "bg-white text-black" : "bg-gray-900 text-white"
            }`}
        >
            <h1 className="text-4xl font-bold mb-8">
                It&#39;s {gameState.getPhase()}!
            </h1>

            {Object.entries(votes).map(([voter, selectedPlayer]) => (
                <p key={voter} className="text-lg">
                    {voter} has selected {selectedPlayer}.
                </p>
            ))}

            <button
                onClick={togglePhase}
                className="px-6 py-3 text-lg text-white bg-red-600 rounded-md transition-colors hover:bg-red-700"
            >
                Switch to {gameState.getPhase() === "day" ? "Night" : "Day"}
            </button>
        </div>
    );
};

export default Narrator;



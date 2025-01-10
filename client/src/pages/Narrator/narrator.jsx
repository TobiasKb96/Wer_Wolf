import { useState, useEffect } from "react";
import gameController from "../Game/gamelogic/gameController.js";
import socket from "../../utils/socket.js";
import PropTypes from "prop-types";
import Join from "../Join/join.jsx";
import Player from "../Game/gamelogic/Player.js";


//TODO show names of all participants and their roles
//TODO provide instructions for phases
//TODO provide buttons to transition phases/end game
//TODO should: provide timers, Narrator has option to kill players (this allows to keep track of who is alive, so the script changes accordingly)
//TODO narrator sends out alert to player to start voting process -> button gets available
//TODO narrator gets prompt from server to start voting process
//TODO after: voting starts with timer -> based on computed narrator

function Narrator ({joinedLobbyParticipants}) {
    const [votes, setVotes] = useState({});
    const [currentPhase, setCurrentPhase] = useState(gameController.getPhase());
    const [sessionID, setSessionID] = useState(gameController.getSessionID());

    const wait = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const gameLoop = () => {
        //TODO implement game loop

    }


    useEffect( () => {

        const initializeGame = async () => {
            gameController.distributeRoles(joinedLobbyParticipants);
            console.log("Role distributed in original order:", joinedLobbyParticipants);

            await wait(5000);  // Replace this if you want a different wait mechanism

            socket.emit("sendPlayers", gameController.getPlayers());
            console.log("Players sent to server:", gameController.getPlayers());
        };

        initializeGame();
        //socket.on('gameStarted', gameStartedHandler);

        return () => {
            // Clean up listeners
            //socket.off('playerJoinedSuccessfully', playerJoinedSuccessfullyHandler);

        };
    }, []);
    //socket.emit("getPlayers", )

    useEffect(() => {
        setVotes({ ...gameController.votes }); // Sync votes with gameController
    }, [gameController.votes]);

    const togglePhase = () => {
        const newPhase = currentPhase === "day" ? "night" : "day";
        gameController.setPhase(newPhase);
        setCurrentPhase(newPhase);
    };

    useEffect(() => {
        socket.emit("sendPhase", currentPhase);
        console.log();
    }, [currentPhase]);

    const startVoting = (voters, victims) => {
        //TODO send out alert to all players to start voting

    };




    return (
        <div
            className={`flex flex-col items-center justify-center min-h-screen transition-colors ${
                gameController.getPhase() === "day" ? "bg-white text-black" : "bg-gray-900 text-white"
            }`}
        >
            <h1 className="text-4xl font-bold mb-8">
                It&#39;s {gameController.getPhase()}!
            </h1>

            {Object.entries(votes).map(([voter, selectedPlayer]) => (
                <p key={voter} className="text-lg">
                    {voter} has selected {selectedPlayer}.
                </p>
            ))}

            <button
                onClick={startVoting}
                className="px-6 py-3 text-lg text-white bg-blue-600 rounded-md transition-colors hover:bg-blue-700"
            >
                Start Voting
            </button>
            <button
                onClick={togglePhase}
                className="px-6 py-3 text-lg text-white bg-red-600 rounded-md transition-colors hover:bg-red-700"
            >
                Switch to {gameController.getPhase() === "day" ? "Night" : "Day"}
            </button>
        </div>
    );
};

Narrator.propTypes = {
    joinedLobbyParticipants: PropTypes.array.isRequired,
};


export default Narrator;



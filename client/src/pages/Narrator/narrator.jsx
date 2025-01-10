import { useState, useEffect } from "react";
import gameState from "../Game/gamelogic/gameState.js";
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
    const [currentPhase, setCurrentPhase] = useState(gameState.getPhase());
    const [sessionID, setSessionID] = useState(gameState.getSessionID());


    const distributeRoles = (lobbyParticipants) => {
        const numberOfWerewolves = lobbyParticipants.length <= 5 ? 1 : 2;

        // Generate a shuffled list of roles
        const roles = Array(lobbyParticipants.length).fill("Villager");
        for (let i = 0; i < numberOfWerewolves; i++) {
            roles[i] = "Werewolf";
        }
        const shuffledRoles = roles.sort(() => Math.random() - 0.5);

        // Assign roles back to participants in the original order
        lobbyParticipants.forEach((participant, index) => {
            participant.role = shuffledRoles[index];
        });



        // Debugging: log the distributed roles
        console.log("Roles distributed in original order:", lobbyParticipants);
    };

    useEffect(() => {

        distributeRoles(joinedLobbyParticipants);
        console.log("Roles distributed in original order:", joinedLobbyParticipants);



        for(const player of joinedLobbyParticipants) {
            gameState.addPlayer(new Player(player.name, player.role, player.id));
        }
        console.log("Players added to gameState:", gameState.getPlayers());
        socket.emit("sendPlayers", gameState.getPlayers());



        //socket.on('gameStarted', gameStartedHandler);

        return () => {
            // Clean up listeners
            //socket.off('playerJoinedSuccessfully', playerJoinedSuccessfullyHandler);

        };
    }, []);
    //socket.emit("getPlayers", )

    useEffect(() => {
        setVotes({ ...gameState.votes }); // Sync votes with gameState
    }, [gameState.votes]);

    const togglePhase = () => {
        const newPhase = currentPhase === "day" ? "night" : "day";
        gameState.setPhase(newPhase);
        setCurrentPhase(newPhase);
    };

    const toggleVoting = () => {
        //TODO send out alert to all players to start voting
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
                onClick={toggleVoting}
                className="px-6 py-3 text-lg text-white bg-blue-600 rounded-md transition-colors hover:bg-blue-700"
            >
                Start Voting
            </button>
            <button
                onClick={togglePhase}
                className="px-6 py-3 text-lg text-white bg-red-600 rounded-md transition-colors hover:bg-red-700"
            >
                Switch to {gameState.getPhase() === "day" ? "Night" : "Day"}
            </button>
        </div>
    );
};

Narrator.propTypes = {
    joinedLobbyParticipants: PropTypes.array.isRequired,
};


export default Narrator;



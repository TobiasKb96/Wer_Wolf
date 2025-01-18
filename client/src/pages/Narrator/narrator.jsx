import {useState, useEffect} from "react";
import gameController from "../Game/gamelogic/gameController.js";
import socket from "../../utils/socket.js";
import PropTypes from "prop-types";
import Join from "../Join/join.jsx";
import Player from "../Game/gamelogic/Player.js";
import PlayerOverview from "../../components/playerOverview.jsx";
import game from "../Game/game.jsx";
import sunImg from '../../assets/sun.png';
import moonImg from '../../assets/moon.png';

//TODO show names of all participants and their roles
//TODO provide instructions for phases
//TODO provide buttons to transition phases/end game
//TODO should: provide timers, Narrator has option to kill players (this allows to keep track of who is alive, so the script changes accordingly)
//TODO narrator sends out alert to player to start voting process -> button gets available
//TODO narrator gets prompt from server to start voting process
//TODO after: voting starts with timer -> based on computed narrator

function Narrator({joinedLobbyParticipants, selectedRoles}) {
    const [votes, setVotes] = useState({});
    const [currentPhase, setCurrentPhase] = useState(gameController.getPhase());
    const [sessionID, setSessionID] = useState(gameController.getSessionID());

    const wait = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const gameLoop = () => {
        //TODO implement game loop
        // gameController.dayPhase();
        // gameController.nightPhase();
    }

    const initializeGame = async () => {
        gameController.distributeRoles(joinedLobbyParticipants, selectedRoles);
        console.log("Role distributed in original order:", joinedLobbyParticipants);

        await wait(500);  // Replace this if you want a different wait mechanism

        socket.emit("sendPlayers", gameController.getPlayers());
        console.log("Players sent to server:", gameController.getPlayers());
    };

    useEffect(() => {

        initializeGame();
        //socket.on('gameStarted', gameStartedHandler);

        gameLoop();

        return () => {
            // Clean up listeners
            //socket.off('playerJoinedSuccessfully', playerJoinedSuccessfullyHandler);

        };
    }, []);
    //socket.emit("getPlayers", )

    useEffect(() => {
        setVotes({...gameController.votes}); // Sync votes with gameController
    }, [gameController.votes]);

    useEffect(() => {
        socket.on('voteResult', (mostVotedPlayer) => {
            alert(`${mostVotedPlayer} has been killed!`);
        });


        return () => {
            socket.off('voteResult');
            socket.off('startVoting');
        };
    }, []);

    const togglePhase = () => {
        const newPhase = currentPhase === "day" ? "night" : "day";
        gameController.setPhase(newPhase);
        setCurrentPhase(newPhase);
    };

    useEffect(() => {
        socket.emit("sendPhase", currentPhase);
        console.log();
    }, [currentPhase]);


    const startVoting = () => {
        const players = gameController.getPlayers();
        const voters = players.filter(player => player.role.roleName === "Werewolf");
        const choices = players.filter(player => player.role.roleName !== "Werewolf");
        const txtMsg = "Kill now!";
        socket.emit("startVoting", {voters, choices, txtMsg});
        console.log("voters: ", voters, "victims: ", choices);
    }
    //TODO: Narrator mobile view


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
                <p key={voter} className="text-lg">{voter} has selected {selectedPlayer}.</p>
            ))}
            <button onClick={startVoting}
                    className="px-6 py-3 text-lg text-white bg-red-600 rounded-md transition-colors hover:bg-red-700"
            >
                Start Voting
            </button>
            <button
                onClick={togglePhase}
                className="px-6 py-3 text-lg text-white bg-red-600 rounded-md transition-colors hover:bg-red-700"
            >
                Switch to {gameController.getPhase() === "day" ? "Night" : "Day"}
            </button>

            {<div><PlayerOverview player={this}/></div>}
            className="flex overflow-hidden flex-col px-1.5 pb-2 mx-auto w-full h-full text-center text-black bg-yellow-950">

            <div
                className="overflow-visible self-stretch px-8 py-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl whitespace-nowrap rounded-b-xl border-solid bg-stone-300 border-neutral-500 shadow-[0px_2px_2px_rgba(0,0,0,0.25)] font-metal">
                Wer?Wolf
            </div>


            <div
                className={`flex flex-col sm:flex-row w-full flex-grow p-4 sm:p-6 gap-4 sm:gap-6 ${
                    gameController.getPhase() === "day" ? "bg-white text-black" : "bg-gray-900 text-white"
                }`}>


                {/*Narrator Script*/}
                <div className="flex-1 border border-stone-600 bg-zinc-100 p-4 rounded-lg overflow-y-auto">
                    <h2 className="text-lg sm:text-xl font-bold mb-4 text-black">Script</h2>
                </div>


                {Object.entries(votes).map(([voter, selectedPlayer]) => (
                    <p key={voter} className="text-lg">
                        {voter} has selected {selectedPlayer}.
                    </p>
                ))}

                {/* Player Overview Component*/}
                <div className="w-full sm:w-1/3 lg:w-1/4 p-4 overflow-hidden"><PlayerOverview player={this}/>
                </div>

            </div>
            <footer className="flex justify-between p-4 sm:p-6">
                <button
                    //TODO: add end game functionality
                    className="w-1/3 sm:w-1/4 lg:w-1/5 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-lg bg-orange-200 text-black rounded-md hover:bg-orange-300 transition-all"
                >
                    End Game
                </button>

                <button
                    onClick={startVoting}
                    className="w-1/3 sm:w-1/4 lg:w-1/5 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-lg bg-orange-200 text-black rounded-md hover:bg-orange-300 transition-all"
                >
                    Start Voting
                </button>

                <button
                    onClick={togglePhase}
                    className="w-1/3 sm:w-1/4 lg:w-1/5 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-lg bg-orange-200 text-black rounded-md hover:bg-orange-300 transition-all"
                >
                    Next Phase
                </button>
            </footer>


        </div>

    )
}

Narrator.propTypes = {
    joinedLobbyParticipants: PropTypes.array.isRequired,
    selectedRoles: PropTypes.array.isRequired,
};


export default Narrator;




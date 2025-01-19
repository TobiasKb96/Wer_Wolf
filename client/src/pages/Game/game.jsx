import Join from "../Join/join.jsx";
import {useState, useEffect} from "react";
import io from "socket.io-client";
import gameController from "./gamelogic/gameController.js";
import LobbyParticipants from "../../components/LobbyParticipants.jsx";
import PropTypes from "prop-types";
import Player from "./gamelogic/Player.js";
import socket from "../../utils/socket.js";
import PlayerOverview from "../../components/playerOverview.jsx";


//TODO Anna

//TODO show your own role, (all players that are not the narrator, are on this page)
//TODO should Steffi / Anna: show timers, inform player if he died, allow players to choose a player to chat to during daytime (insert chat component) Timer needs to be implemented in gameController

//TODO use player from parent
//TODO M5. The system shall provide 2 playable characters, Werewolf.js and villager -> playable debateable -> voting ?
//TODO M6 Steffi. The system shall manage game phases to differentiate between day and night.
//TODO M7 Steffi / Anna. The system shall provide the narrator with an overview of the characters of the players.
//TODO M8 Steffi.	The system shall display the narrator’s script, including all necessary prompts and instructions, on the narrator’s device.

function Game({ownSocketId, messages, setMessages}) {
    const [isNight] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState("");
    const [player, setPlayer] = useState(null); // search for id in gamestate after initial fill
    const [phase, setPhase] = useState('day');


    const playersReceivedHandler = (players) => {
        console.log("Players received:", players);
        gameController.setPlayers(players);
        if (player === null) {
            setPlayer(gameController.findPlayerById(ownSocketId));
        }
        console.log(player);

    }

    const phaseReceivedHandler = (phase) => {
        gameController.setPhase(phase);
        setPhase(phase);
        console.log(player);
    }

    useEffect(() => {
        console.log("Own Socket Id object handed over:", ownSocketId)
    }, [ownSocketId]);

    useEffect(() => {
        socket.on('playersReceived', playersReceivedHandler);
        socket.on('phaseReceived', phaseReceivedHandler);

        return () => {
            // Clean up listeners
            socket.off('playersReceived', playersReceivedHandler);
            socket.off('phaseReceived', phaseReceivedHandler);
        };
    }, []);

    /*
        if (!player.isAlive) {
                alert("You have died!");
            }
        }, [player.isAlive]);
    */
    const handleShowRole = () => {
        alert(`Your role is: ${player.role.roleName}`);
    };

    const handleVoteClick = () => {
        if (showDropdown && selectedPlayer) {
            // Send vote to gameController
            gameController.castVote(name, selectedPlayer);
            alert(`${name} has voted for ${selectedPlayer}`);
            setShowDropdown(false);
        } else {
            setShowDropdown(true);
        }
    };
    return (
        <div
            className={`flex flex-col items-center justify-center min-h-screen transition-colors ${
                gameController.getPhase() === "day" ? "bg-white text-black" : "bg-gray-900 text-white"
            }`}
        >
            <h1 className="text-4xl font-bold mb-8">
                {gameController.getPhase()}!
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
                    {gameController.getPlayers()
                        .filter((foe) => foe.name !== player.name) // Exclude self
                        .map((foe) => (
                            <option key={foe.id} value={foe.name}>
                                {foe.name}
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

            {player && (
                <div>
                    <PlayerOverview player={player} messages={messages} setMessages={setMessages}/>
                </div>
            )}
        </div>
    );

}

Game.propTypes = {
    ownSocketId: PropTypes.string.isRequired,
};

export default Game;
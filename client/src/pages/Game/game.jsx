import Join from "../Join/join.jsx";
import {useState, useEffect} from "react";
import io from "socket.io-client";
import gameController from "./gamelogic/gameController.js";
import LobbyParticipants from "../../components/LobbyParticipants.jsx";
import PropTypes from "prop-types";
import Player from "./gamelogic/Player.js";
import socket from "../../utils/socket.js";
import PlayerOverview from "../../components/playerOverview.jsx";


//TODO should Steffi / Anna: show timers, inform player if he died, allow players to choose a player to chat to during daytime (insert chat component) Timer needs to be implemented in gameController


//TODO M6 Steffi. The system shall manage game phases to differentiate between day and night.
//TODO M8 Steffi.	The system shall display the narrator’s script, including all necessary prompts and instructions, on the narrator’s device.

function Game({ownSocketId, messages, setMessages}) {
    const [isNight] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState("");
    const [player, setPlayer] = useState(null); // search for id in gamestate after initial fill
    const [phase, setPhase] = useState('day');
    const [showPotions, setShowPotions] = useState(false);
    const [healingUsed, setHealingUsed] = useState(false);
    const [poisonUsed, setPoisonUsed] = useState(false);
    let playerObject = null;


    const playersReceivedHandler = (players) => {
        console.log("Players received:", players);
        gameController.setPlayers(players);
        const thisPlayer = gameController.findPlayerById(ownSocketId)
        playerObject = thisPlayer;
        console.log(playerObject)
        setPlayer(thisPlayer);
        console.log("this player is", player)
    }

    const phaseReceivedHandler = (phase) => {
        gameController.setPhase(phase);
        setPhase(phase);
        console.log(player);
    }

    const witchShowPotionsHandler = () => {
        console.log("socket is on")
        console.log("I am in witchShowPotionsHandler", player)
        console.log("I am in witchShowPotionsHandler my role is", playerObject.role.roleName)
        if (playerObject.role.roleName === "Witch") {
            setShowPotions(true);
            console.log("Potions should be shown");
        }
    }

    useEffect(() => {
        // Listen for incoming messages
        socket.on('listenMessages', (message) => {
            console.log("message received", message)
            setMessages((prevMessages) => [...prevMessages, message]);

        });

        return () => {
            socket.off('listenMessages');
        };
    }, []);


    useEffect(() => {
        console.log("Own Socket Id object handed over:", ownSocketId)
    }, [ownSocketId]);

    useEffect(() => {
        socket.on('playersReceived', playersReceivedHandler);
        socket.on('phaseReceived', phaseReceivedHandler);
        socket.on('witchShowPotions', witchShowPotionsHandler);

        return () => {
            // Clean up listeners
            socket.off('playersReceived', playersReceivedHandler);
            socket.off('phaseReceived', phaseReceivedHandler);
        };
    }, []);


    const handlePotionUse = (potionType) => {
        if (potionType === "healing" && !healingUsed) {
            socket.emit('healingPotion');
            setHealingUsed(true);  // Disable healing potion
        } else if (potionType === "poison" && !poisonUsed) {
            socket.emit('poisonPotion');
            setPoisonUsed(true);  // Disable poison potion
        }
    };


    socket.on('showRole', (revealedPlayer) =>{
        alert(`${revealedPlayer.name}'s Role is: ${revealedPlayer.role.roleName}`)
    });



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
            className="flex overflow-hidden flex-col px-1.5 pb-2 mx-auto w-full h-full text-center text-black bg-yellow-950">
            <div
                className="overflow-visible self-stretch px-8 py-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl whitespace-nowrap rounded-b-xl border-solid bg-stone-300 border-neutral-500 shadow-[0px_2px_2px_rgba(0,0,0,0.25)] font-metal">
                Wer?Wolf
            </div>

            <div
                className={`flex flex-col items-center justify-center w-full flex-grow py-8 px-4 ${
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

                {showPotions && (
                    <div className="mt-6 p-4 border rounded bg-gray-200">
                        <h2 className="text-xl font-semibold mb-4">Choose a Potion</h2>
                        <button
                            onClick={() => handlePotionUse("healing")}
                            disabled={healingUsed}
                            className={`px-4 py-2 rounded-lg mr-2 ${
                                healingUsed
                                    ? "bg-gray-400 cursor-not-allowed"  // Greyed out when used
                                    : "bg-green-500 hover:bg-green-600 text-white"
                            }`}
                        >
                            {healingUsed ? "Healing Potion Used" : "Use Healing Potion"}
                        </button>

                        <button
                            onClick={() => handlePotionUse("poison")}
                            disabled={poisonUsed}
                            className={`px-4 py-2 rounded-lg ${
                                poisonUsed
                                    ? "bg-gray-400 cursor-not-allowed"  // Greyed out when used
                                    : "bg-red-500 hover:bg-red-600 text-white"
                            }`}
                        >
                            {poisonUsed ? "Poison Potion Used" : "Use Poison Potion"}
                        </button>
                    </div>
                )}


                {player && (
                    <div>
                        <PlayerOverview player={player} messages={messages} setMessages={setMessages}/>
                    </div>
                )}
            </div>
</div>
)
    ;

}

Game.propTypes = {
    ownSocketId: PropTypes.string.isRequired,
};

export default Game;
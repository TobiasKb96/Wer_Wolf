import React, {useState, useEffect} from "react";
import gameController from "./gamelogic/gameController.js";
import PropTypes from "prop-types";
import socket from "../../utils/socket.js";
import PlayerOverview from "../../components/playerOverview.jsx";
import Voting from "../../components/voting.jsx";
import ModalOverview from "../../components/modalOverview.jsx";
//import sunImg from '../../assets/sun.png';
//import moonImg from '../../assets/moon.png';
import '/transitionStyle.css'; // Import the CSS file

//TODO should Steffi / Anna: show timers, inform player if he died, allow players to choose a player to chat to during daytime (insert chat component) Timer needs to be implemented in gameController


//TODO M6 Steffi. The system shall manage game phases to differentiate between day and night.
//TODO M8 Steffi.	The system shall display the narrator’s script, including all necessary prompts and instructions, on the narrator’s device.


//TODO: when switch to day have a message saying these players died: and then the showRole socket for each player that died
function Game({ownSocketId, messages, setMessages}) {
    const [player, setPlayer] = useState(null); // search for id in gamestate after initial fill
    const [phase, setPhase] = useState('day');
    const [showPotions, setShowPotions] = useState(false);
    const [healingUsed, setHealingUsed] = useState(false);
    const [poisonUsed, setPoisonUsed] = useState(false);
    let playerObject = null;
    const [voting, setVoting] = useState(false);
    const [votingChoices, setVotingChoices] = useState([]);
    const [votingMsg, setVotingMsg] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

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
        socket.on('votePrompt', startVotingHandler);
        socket.on('showRole', handleShowSomeoneElsesRole);

        socket.on('witchShowPotions', witchShowPotionsHandler);

        return () => {
            // Clean up listeners
            socket.off('playersReceived', playersReceivedHandler);
            socket.off('phaseReceived', phaseReceivedHandler);
            socket.off('votePrompt');
        };
    }, []);

    const playersReceivedHandler = (players) => {
        gameController.setPlayers(players);
        const thisPlayer = gameController.findPlayerById(ownSocketId)
        playerObject = thisPlayer;
        setPlayer(thisPlayer);
    };

    const phaseReceivedHandler = (phase) => {
        gameController.setPhase(phase);
        setPhase(phase);
    };


    const witchShowPotionsHandler = () => {
        if (playerObject.role.roleName === "Witch") {
            setShowPotions(true);
        }
    };

    const handlePotionUse = (potionType) => {
        if (potionType === "healing" && !healingUsed) {
            socket.emit('healingPotion');
            setHealingUsed(true);  // Disable healing potion
        } else if (potionType === "poison" && !poisonUsed) {
            socket.emit('poisonPotion');
            setPoisonUsed(true);  // Disable poison potion
        } else if (potionType === "skip") {
            socket.emit('skipPotions');
            setShowPotions(false);
        }
    };

    const handleShowSomeoneElsesRole = (revealedPlayer) => {
        console.log("In game the revealing alert is called:", revealedPlayer);
        gameController.getPlayers().forEach(player => {
            if (player.name === revealedPlayer) {
                const revealedPlayerObject = player;
                alert(`${revealedPlayerObject.name}'s Role is: ${revealedPlayerObject.role.roleName}`)
            }
        });
    };

    const handleShowRole = () => {
        setModalOpen(true);
    };

    const startVotingHandler = ({choices, txtMsg}) => {
        console.log("Choices are ", choices)
        setVotingChoices(choices);
        setVoting(true);
        setVotingMsg(txtMsg);
        console.log("votingstate: ", voting);

    };

    return (
        <div
            className="flex overflow-scroll flex-col items-center justify-center min-h-screen bg-gray-800 text-white">
            {/*Day time night time section */}
            <div className="flex flex-col items-center p-4 bg-gray-700 w-full">
                <div
                    className={`flex flex-col items-center justify-center w-full min-h-screen transition-colors ${phase === "day" ? "bg-blue-300" : "bg-gray-800"}`}>
                    <div className="relative w-full h-1/2">
                        {/* {phase === "day" ? (
                        {/* <img
                            src={sunImg}
                            alt="Sun"
                            className="transition-transform duration-1000 transform sun-animation"
                        />
                    ) : (
                        <img
                            src={moonImg}
                            alt="Moon"
                            className="transition-transform duration-1000 transform moon-animation"
                        />
                    ) */}
                    </div>
                    <h1 className="text-4xl font-bold mb-8">
                        It is {phase}!
                    </h1>
                </div>

                {/* Player Info Section */}
                <div className="flex flex-col items-center w-full p-4 bg-gray-900 rounded-lg mt-4">
                    <div className="w-full sm:w-2/3 lg:w-1/2 p-4 bg-gray-900 rounded-lg mt-4">
                        {player &&
                            <PlayerOverview player={player} messages={messages} setMessages={setMessages}/>}</div>
                </div>

                <button
                    onClick={handleShowRole}
                    className="px-6 py-3 text-lg text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
                >
                    Show Role
                </button>

                {/*Show potions section for witch */}
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
                            className={`px-4 py-2 rounded-lg mr-2 ${
                                poisonUsed
                                    ? "bg-gray-400 cursor-not-allowed"  // Greyed out when used
                                    : "bg-red-500 hover:bg-red-600 text-white"
                            }`}
                        >
                            {poisonUsed ? "Poison Potion Used" : "Use Poison Potion"}
                        </button>

                        <button
                            onClick={() => handlePotionUse("skip")}
                            className={`px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white`}
                        >
                            Skip Potion Use
                        </button>
                    </div>
                )}

                {/* Voting Section */}
                {voting &&
                    <Voting player={player} votingChoices={votingChoices} votingMsg={votingMsg} setVoting={setVoting}/>}
                {modalOpen && <ModalOverview player={player} onClose={() => setModalOpen(false)}/>
                }
            </div>
        </div>
    );
}

Game.propTypes = {
    ownSocketId: PropTypes.string.isRequired,
    messages: PropTypes.array.isRequired,
    setMessages: PropTypes.func.isRequired,
};

export default Game;
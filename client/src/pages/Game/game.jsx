import React, {useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom';
import gameController from "./gamelogic/gameController.js";
import PropTypes from "prop-types";
import socket from "../../utils/socket.js";
import PlayerOverview from "../../components/playerOverview.jsx";
import Voting from "../../components/voting.jsx";
import ModalOverview from "../../components/modalOverview.jsx";
import sunImg from '../../assets/sun.png';
import moonImg from '../../assets/moon.png';
import '/transitionStyle.css'; // Import the CSS file

//TODO should Steffi / Anna: show timers, inform player if he died, allow players to choose a player to chat to during daytime (insert chat component) Timer needs to be implemented in gameController


//TODO M6 Steffi. The system shall manage game phases to differentiate between day and night.
//TODO M8 Steffi.	The system shall display the narrator’s script, including all necessary prompts and instructions, on the narrator’s device.


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
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [transitionClass, setTransitionClass] = useState('radial-emerge');
    const navigate = useNavigate();


    const wait = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    useEffect(() => {
        // Listen for incoming messages
        socket.on('listenMessages', (message) => {
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
        socket.on('gameOver', gameOverHandler);
        socket.on('phaseReceived', phaseReceivedHandler);
        socket.on('votePrompt', startVotingHandler);
        socket.on('showRole', handleShowSomeoneElsesRole);
        socket.on('witchShowPotions', witchShowPotionsHandler);

        return () => {
            // Clean up listeners
            socket.off('playersReceived', playersReceivedHandler);
            socket.off('phaseReceived', phaseReceivedHandler);
            socket.on('gameOver', gameOverHandler);
            socket.off('votePrompt',startVotingHandler);
            socket.off('witchShowPotions', witchShowPotionsHandler);
            socket.off('showRole', handleShowSomeoneElsesRole);

        };
    }, []);

    const gameOverHandler = (winResult) => {
        alert(`${winResult}, won the game!`);
        console.log("Game Over");
        navigate("/home");
    }
    const playersReceivedHandler = (players) => {
        const previousPlayers = gameController.getPlayers();
        gameController.setPlayers(players);

        players.forEach((newPlayer) => {
            const previousPlayer = previousPlayers.find((p) => p.name === newPlayer.name);
            if (previousPlayer && previousPlayer.isAlive && !newPlayer.isAlive) {
                alert(`${newPlayer.name} has died!`);
            }
        });

        const thisPlayer = gameController.findPlayerById(ownSocketId)
        if (thisPlayer.role.goalCondition === "Lovers" && thisPlayer.role.goalCondition !== playerObject.role.goalCondition) {
            alert("You are a Lover, your goal is to find your Lover");
            gameController.players.forEach(player => {
                if (player.role.goalCondition === "Lovers") {
                    player.showRole = true;
                }
            })
        }
        if (thisPlayer.role.goalCondition === "Lovers") {
            gameController.players.forEach(player => {
                if (player.role.goalCondition === "Lovers") {
                    player.showRole = true;
                }
            })
        }
        playerObject = thisPlayer;
        setPlayer(thisPlayer);

    };

    const phaseReceivedHandler = (phase) => {
        gameController.setPhase(phase);
        setPhase(phase);
    };
    useEffect(() => {
        const handlePhaseTransition = () => {
            setTransitionClass('radial-leave');
            setPhase((prevPhase) => (prevPhase === 'day' ? 'night' : 'day'));
            setTransitionClass('radial-emerge');
        };
        socket.on('phaseChange', handlePhaseTransition);
    }, []);

    const witchShowPotionsHandler = () => {
        if (playerObject.role.roleName === "Witch") {
            setShowPotions(true);
        }
    };

    const handlePotionUse = (potionType) => {

        if (potionType === "healing" && !healingUsed) {
            socket.emit('healingPotion');
            setHealingUsed(true);  // Disable healing potion
            setShowPotions(false);
        } else if (potionType === "poison" && !poisonUsed) {
            socket.emit('poisonPotion');
            setPoisonUsed(true);  // Disable poison potion
            setShowPotions(false);
        } else if (potionType === "skip") {
            socket.emit('skipPotions');
            setShowPotions(false);
        }
    };

    const handleShowSomeoneElsesRole = async (revealedPlayer) => {
        console.log("In game the revealing alert is called:", revealedPlayer);
        for (const player of gameController.getPlayers()) {
            if (player.name === revealedPlayer) {
                const revealedPlayerObject = player;
                await wait(500);
                alert(`${revealedPlayerObject.name}'s Role is: ${revealedPlayerObject.role.roleName}`);
                //revealedPlayerObject.isAlive = false;
            }
        }
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
            className={`flex overflow-auto flex-col px-1.5 pb-2 mx-auto w-full h-full text-center text-black`}>
            <div
                className="overflow-visible self-stretch px-8 py-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl whitespace-nowrap rounded-b-xl border-solid bg-stone-300 border-neutral-500 shadow-[0px_2px_2px_rgba(0,0,0,0.25)] font-metal">
                Wer?Wolf
            </div>
            <div
                className={`flex min-h-72 justify-center items-center relative ${phase === 'day' ? 'bg-blue-300' : 'bg-gray-800'}`}>
                <div
                    className={`relative w-1/2 h-1/2 transition-transform transform ${transitionClass}`}
                    style={{
                        backgroundImage: `url(${phase === 'day' ? sunImg : moonImg})`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                    }}
                ></div>
            </div>
            <div className={'flex-1 bg-white flex flex-col justify-center items-center space-y-6 p-6'}>
                <h1 className="text-4xl font-bold mb-8">
                    It is {phase}!
                </h1>

                {player && !player.isAlive && (<h1 className="text-4xl font-bold mb-8 text-red-600" >
                    You died!
                </h1>
                )}

                <button
                    onClick={handleShowRole}
                    className="px-6 py-3 text-lg text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
                >
                    Show Role
                </button>

                {player && (
                    <div>
                        <PlayerOverview player={player} messages={messages} setMessages={setMessages} phase={phase}/>
                    </div>
                )}

                {showPotions && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div
                            className="relative p-6 bg-purple-900 text-white rounded-xl shadow-lg border border-purple-700 w-96">
                            <h2 className="text-2xl font-bold mb-4 text-center text-purple-300">
                                Choose a Potion
                            </h2>
                            <div className="flex flex-col space-y-4 items-center">
                                <button
                                    onClick={() => handlePotionUse("healing")}
                                    disabled={healingUsed}
                                    className={`potion-button ${
                                        healingUsed
                                            ? "bg-gray-500 cursor-not-allowed"
                                            : "bg-green-600 hover:bg-green-700"
                                    }`}
                                >
                                    {healingUsed ? "Healing Potion Used" : "Use Healing Potion"}
                                </button>
                                <button
                                    onClick={() => handlePotionUse("poison")}
                                    disabled={poisonUsed}
                                    className={`potion-button ${
                                        poisonUsed
                                            ? "bg-gray-500 cursor-not-allowed"
                                            : "bg-red-600 hover:bg-red-700"
                                    }`}
                                >
                                    {poisonUsed ? "Poison Potion Used" : "Use Poison Potion"}
                                </button>
                                <button
                                    onClick={() => handlePotionUse("skip")}
                                    className="potion-button bg-purple-650 hover:bg-purple-700"
                                >
                                    Skip Potion Use
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Voting Section */}
                {voting &&
                    <Voting player={player} votingChoices={votingChoices} votingMsg={votingMsg} setVoting={setVoting}
                            txtMsg={votingMsg}/>}
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
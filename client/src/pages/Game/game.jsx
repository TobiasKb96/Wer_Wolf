import React, {useState, useEffect} from "react";
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
        if (!isFirstRender && phase === "day") {
            console.log(" if is called");
            alert("These players died tonight: ");
        }
        setIsFirstRender(false); // Update first render after the check
    }, [phase]);


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
            socket.off('witchShowPotions', witchShowPotionsHandler);
            socket.off('showRole', handleShowSomeoneElsesRole);
        };
    }, []);

    const playersReceivedHandler = (players) => {
        gameController.setPlayers(players);
        const thisPlayer = gameController.findPlayerById(ownSocketId)
        playerObject = thisPlayer;
        if (player === null) {
            setPlayer(thisPlayer);
        }
    };

    const phaseReceivedHandler = (phase) => {
        gameController.setPhase(phase);
        setPhase(phase);
       /* if (!isFirstRender && phase === "day") {
            console.log("if is called")
            alert("These players died tonight: ");
        }
        setIsFirstRender(false);*/
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
        } else if (potionType === "poison" && !poisonUsed) {
            socket.emit('poisonPotion');
            setPoisonUsed(true);  // Disable poison potion
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
                revealedPlayerObject.isAlive = false;
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
                className={`flex justify-center items-center relative ${phase === 'day' ? 'bg-blue-300' : 'bg-gray-800'}`}
                style={{ height: '50vh', overflow: 'hidden' }} >
                <div
                    className={`absolute w-1/2 h-1/2 transition-transform transform ${transitionClass}`}
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
                            className={`px-4 py-2 rounded-lg bg-purple-800 hover:bg-purple-950 text-white`}
                        >
                            Skip Potion Use
                        </button>
                    </div>
                )}

                {/* Voting Section */}
                {voting &&
                    <Voting player={player} votingChoices={votingChoices} votingMsg={votingMsg} setVoting={setVoting} txtMsg={votingMsg}/>}
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
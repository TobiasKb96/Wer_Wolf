import Join from "../Join/join.jsx";
import React, {useState, useEffect} from "react";
import gameController from "./gamelogic/gameController.js";
import LobbyParticipants from "../../components/LobbyParticipants.jsx";
import PropTypes from "prop-types";
import Player from "./gamelogic/Player.js";
import socket from "../../utils/socket.js";
import PlayerOverview from "../../components/playerOverview.jsx";
import Voting from "../../components/voting.jsx";
import modalOverview from "../../components/modalOverview.jsx";
import ModalOverview from "../../components/modalOverview.jsx";
import sunImg from '../../assets/sun.png';
import moonImg from '../../assets/moon.png';
import '/transitionStyle.css'; // Import the CSS file

//TODO Anna

//TODO show your own role, (all players that are not the narrator, are on this page)
//TODO should Steffi / Anna: show timers, inform player if he died, allow players to choose a player to chat to during daytime (insert chat component) Timer needs to be implemented in gameController

//TODO use player from parent
//TODO M5. The system shall provide 2 playable characters, Werewolf.js and villager -> playable debateable -> voting ?
//TODO M6 Steffi. The system shall manage game phases to differentiate between day and night.
//TODO M7 Steffi / Anna. The system shall provide the narrator with an overview of the characters of the players.
//TODO M8 Steffi.	The system shall display the narrator’s script, including all necessary prompts and instructions, on the narrator’s device.

function Game({ownSocketId, messages, setMessages}) {
    //const [isNight, setIsNight] = useState(false);
    //const [showDropdown, setShowDropdown] = useState(false);
    //const [selectedPlayer, setSelectedPlayer] = useState("");
    const [player, setPlayer] = useState(null); // search for id in gamestate after initial fill
    const [phase, setPhase] = useState('day');
    const [voting, setVoting] = useState(false);
    const [votingChoices, setVotingChoices] = useState([]);
    const [votingMsg, setVotingMsg] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);



    const playersReceivedHandler = (players) => {
        console.log("Players received:", players);
        gameController.setPlayers(players);
        setPlayer(gameController.findPlayerById(ownSocketId));

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
        socket.on('votePrompt', startVotingHandler);


        return () => {
            // Clean up listeners
            socket.off('playersReceived', playersReceivedHandler);
            socket.off('phaseReceived', phaseReceivedHandler);
            socket.off('votePrompt');
        };
    }, []);

    /*
        if (!player.isAlive) {
                alert("You have died!");
            }
        }, [player.isAlive]);
    */
    const handleShowRole = () => {
        setModalOpen(true);
    };
    const startVotingHandler = ({choices, txtMsg}) =>{
        console.log("Choices are ", choices)
        setVotingChoices(choices);
        setVoting(true);
        setVotingMsg(txtMsg);
        console.log("votingstate: ", voting);

    }


    return (
            <div className={'flex flex-col h-screen'}>
                <div className={`flex-1 flex justify-center items-center relative transition-colors ${phase === "day" ? "bg-blue-300" : "bg-gray-800"}`}>
                    <div className="relative w-full h-1/2">
                        {phase === "day" ? (
                            <img
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
                        )}
                    </div>
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
                            <PlayerOverview player={player} messages={messages} setMessages={setMessages} />
                        </div>
                    )}

                    {voting && (
                        <Voting player={player} votingChoices={votingChoices} votingMsg={votingMsg} setVoting={setVoting} />
                    )}

                    {modalOpen && (
                        <ModalOverview player={player} onClose={() => setModalOpen(false)} />
                    )}
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

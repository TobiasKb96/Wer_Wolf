import {useState, useEffect} from 'react';
import socket from '../utils/socket';
import PropTypes from "prop-types";
import ChatRoom from "./chatRoom.jsx";
import gameController from "../pages/Game/gamelogic/gameController.js";
import questionMarkImg from '../assets/questionMark.jpg';


//TODO: when participant/player dies red

const PlayerOverview = ({player, setMessages, messages}) => {
    const [participants, setParticipants] = useState(gameController.getPlayers());
    const [error, setError] = useState(null);
    const [showRole, setShowRole] = useState(false);
    const [chatUser, setChatUser] = useState(null);  // Track selected user for chat

    if (error) {
        return <div className="text-red-500 text-center mt-4">{error}</div>;
    }

    useEffect(() => {
        const players = gameController.getPlayers().map((participant) => {
            if (!participant.isAlive) {
                return { ...participant, showRole: true };
            }
            return participant;
        });

        setParticipants(players);
    },[participants]);



    /*useEffect(() => {
        // Initialize participants only once when the component mounts
        const players = gameController.getPlayers();
        console.log("Fetched participants:", players); // Debug log
        setParticipants(players);
    }, []); // Run only on mount

    useEffect(() => {
        // Automatically enable `showRole` for dead participants
        const updatedParticipants = participants.map((participant) => {
            if (!participant.isAlive && !participant.showRole) {
                return { ...participant, showRole: true }; // Ensure immutability
            }
            return participant;
        });
        setParticipants(updatedParticipants);
    }, [participants]);*/

    const isNarratorView = location.pathname.includes("/narrator");

    const filteredParticipants = isNarratorView
        ? participants
        : participants.filter((p) => p.id !== player.id);



    const handleOpenChat = (participant) => {
        console.log(participants)
        console.log('filteredParticipants:', filteredParticipants);
        setChatUser(participant);  // Open chat with selected participant
    };

    const handleCloseChat = () => {
        setChatUser(null);  // Close chat
    };

    const handleShowRole = () => {
        setShowRole((prevShowRole) => !prevShowRole);
        console.log('filteredParticipants:', filteredParticipants);
        console.log(participants)
        console.log('gamecontroller.getplayer works?', gameController.getPlayers())
    };

    //TODO: have list items scrollable to the right in mobile version

    return (
        <div className="mt-8 mx-auto p-4 max-w-md bg-gray-100 border border-gray-300 rounded-lg shadow-md">
            <h2 className="text-center text-black mb-4 text-xl font-bold">
                Player Overview
            </h2>

            {/* Show Role Button */}
            {isNarratorView && (
                <button
                    onClick={handleShowRole}
                    className="w-full px-4 py-2 mb-4 bg-yellow-950 text-orange-200 rounded-lg hover:bg-yellow-900"
                >
                    {showRole ? 'Hide Roles' : 'Show Roles'}
                </button>
            )}

            {/* Participant List */}
            {participants.length > 0 ? (
                        <ul className="flex sm:flex-col gap-4 flex-row overflow-x-auto">
                            {filteredParticipants.map((participant, index) => (
                                <li
                                    key={index}
                                    className="flex flex-col sm:flex-row items-center p-4 bg-white border border-gray-300 rounded-lg shadow-md min-w-[200px]"
                                >
                                    {/*for the avatar */}
                                    <div className="w-16 h-16 bg-gray-400 rounded-full mb-2">
                                        {showRole || participant.showRole ? <img src={participant.role.roleImg} alt="Role" className="w-full h-full object-cover rounded-full"/> : <img src={questionMarkImg} alt="Role" className="w-full h-full object-cover rounded-full"/>}
                                    </div>

                                    <div className="ml-0 sm:ml-4 text-center sm:text-left">
                                        <p className={`font-bold ${!participant.isAlive ? 'text-red-600' : 'text-black'}`}>
                                            {participant.isAlive ? participant.name : `Killed: ${participant.name}`}
                                        </p>
                                        {(showRole || !participant.isAlive) && (        //TODO: does this work?
                                            <>
                                                <p className="text-sm text-gray-600">Role: {participant.role.roleName}
                                                </p>

                                            </>
                                        )}
                                    </div>
                                    {!isNarratorView && (
                                        <button
                                            onClick={() => handleOpenChat(participant)}
                                            className="mt-2 px-4 py-1 bg-yellow-950 text-white rounded hover:bg-orange-900"
                                        >
                                            Message
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                )
                :
                (
                    <p className="text-center text-gray-700">No participants yet.</p>
                )
            }
            {chatUser && (
                <ChatRoom
                    currentUser={player}
                    recipient={chatUser}
                    messages={messages}
                    setMessages={setMessages}
                    onClose={handleCloseChat}
                />
            )}

        </div>
    )
        ;
};


export default PlayerOverview;
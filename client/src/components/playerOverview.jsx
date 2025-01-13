import {useState, useEffect} from 'react';
import socket from '../utils/socket';
import PropTypes from "prop-types";
import ChatRoom from "./chatRoom.jsx";
import gameController from "../pages/Game/gamelogic/gameController.js";


//TODO: Saving a messages array or sth
//TODO: when participant/player dies red

const PlayerOverview = ({player}) => {
    const [participants, setParticipants] = useState(gameController.getPlayers());
    const [error, setError] = useState(null);
    const [showRole, setShowRole] = useState(false);
    const [chatUser, setChatUser] = useState(null);  // Track selected user for chat

    if (error) {
        return <div className="text-red-500 text-center mt-4">{error}</div>;
    }

    useEffect(() => {
        setParticipants(gameController.getPlayers());
    }, );

    const isNarratorView = location.pathname.includes("/narrator");
    const filteredParticipants = isNarratorView
        ? participants
        : participants.filter((p) => p.id !== player.id);

    const handleOpenChat = (participant) => {
        console.log(participants)
        setChatUser(participant);  // Open chat with selected participant
    };

    const handleCloseChat = () => {
        setChatUser(null);  // Close chat
    };

    const handleShowRole = () => {
        setShowRole((prevShowRole) => !prevShowRole);
    };

    return (
        <div className="mt-8 mx-auto p-4 max-w-md bg-gray-100 border border-gray-300 rounded-lg shadow-md">
            <h2 className="text-center text-[#646cff] mb-4 text-xl font-bold">
                Active Participants
            </h2>

            {/* Show Role Button */}
            {isNarratorView && (
                <button
                    onClick={handleShowRole}
                    className="w-full px-4 py-2 mb-4 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                >
                    {showRole ? 'Hide Roles' : 'Show Roles'}
                </button>
            )}

            {/* Participant List */}
            {participants.length > 0 ? (
                    <ul className="list-none">
                        {filteredParticipants.map((participant, index) => (
                            <li
                                key={index}
                                className="px-4 py-2 mb-2 bg-indigo-100 rounded-md text-gray-700 text-left"
                            >
                                <p className="font-bold">{participant.name}</p>
                                {showRole && (
                                    <>
                                        <p>Role: {participant.role.roleName}
                                        </p>

                                    </>
                                )}
                                {!isNarratorView && (
                                    <button
                                        onClick={() => handleOpenChat(participant)}
                                        className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
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
                    onClose={handleCloseChat}
                />
            )}

        </div>
    )
        ;
};


export default PlayerOverview;
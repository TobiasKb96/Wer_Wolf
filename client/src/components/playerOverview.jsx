import {useState, useEffect} from 'react';
import socket from '../utils/socket';
import PropTypes from "prop-types";
import ChatRoom from "./chatRoom.jsx";
import gameController from "../pages/Game/gamelogic/gameController.js";


//TODO: Message Button making messages
//TODO: when participant/player dies red

const PlayerOverview = ({sessionId, player}) => {
    const [participants, setParticipants] = useState([]);
    const [error, setError] = useState(null);
    const [showRole, setShowRole] = useState(false);
    const [chatUser, setChatUser] = useState(null);  // Track selected user for chat


    useEffect(() => {
        socket.emit('getParticipants', sessionId)
        // Listen for participant updates
        socket.on('updateParticipants', (updatedParticipants) => {
            console.log('Participants updated:', updatedParticipants);
            if (updatedParticipants != null) setParticipants(updatedParticipants);
        });

        // Handle any errors
        socket.on('error', (errMsg) => {
            setError(errMsg);
            console.error('Error:', errMsg);
        });


        // Cleanup on component unmount
        return () => {
            socket.off('updateParticipants'); // Remove listener for participant updates
            socket.off('error'); // Remove error listener
        };
    }, [sessionId]);

    if (error) {
        return <div className="text-red-500 text-center mt-4">{error}</div>;
    }

    const handleOpenChat = (participant) => {
        setChatUser(participant);  // Open chat with selected participant
    };

    const handleCloseChat = () => {
        setChatUser(null);  // Close chat
    };

    const handleShowRole = () => {
        setShowRole(!showRole) // Toggle roles visibility

        if(!showRole){
            document.getElementById('showRoleButton').innerHTML = 'Hide Roles'
        } else { document.getElementById('showRoleButton').innerHTML = 'Show Roles' }
    };




    return (
        <div className="mt-8 mx-auto p-4 max-w-md bg-gray-100 border border-gray-300 rounded-lg shadow-md">
            <h2 className="text-center text-[#646cff] mb-4 text-xl font-bold">
                Active Participants
            </h2>

            {/* Show Role Button */}
            {location.pathname.includes("/narrator") && (
            <button
                onClick={handleShowRole}
                className="w-full px-4 py-2 mb-4 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                id={'showRoleButton'}
            >
                Show Roles
            </button>
            )}

            {/* Participant List */}
            {participants.length > 0 ? (
                <ul className="list-none">
                    {participants.map((participant, index) => (
                        <li
                            key={index}
                            className="px-4 py-2 mb-2 bg-indigo-100 rounded-md text-gray-700 text-left"
                        >
                            <p className="font-bold">{participant.name}</p>
                            {showRole && (
                                <>
                                    <p>Role: {participant.role}
                                    </p>

                                </>
                            )}
                            <button
                                onClick={() => handleOpenChat(participant)}
                                className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Message
                            </button>
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

PlayerOverview.propTypes = {
    sessionId: PropTypes.string.isRequired,
};

export default PlayerOverview;
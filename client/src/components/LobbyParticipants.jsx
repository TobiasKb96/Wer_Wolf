import {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import socket from '../utils/socket';


//TODO option to kick players that joined
//TODO start game button
//TODO start game button is clickable when 4 players are in the lobby

const LobbyParticipants = ({ sessionId }) => {
    const [participants, setParticipants] = useState([]);
    const [error, setError] = useState(null);

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



    return (
        <div className="mt-8 mx-auto p-4 max-w-md bg-gray-100 border border-gray-300 rounded-lg shadow-md">
            <h2 className="text-center text-[#646cff] mb-4 text-xl font-bold">
                Active Participants
            </h2>
            {participants.length > 0 ? (
                <ul className="list-none">
                    {participants.map((participant, index) => (
                        <li
                            key={index}
                            className="px-4 py-2 mb-2 bg-indigo-100 rounded-md text-gray-700 text-center"
                        >
                            {participant.name}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-700">No participants yet.</p>
            )}
        </div>
    );
};

LobbyParticipants.propTypes = {
    sessionId: PropTypes.string.isRequired,
};

export default LobbyParticipants;

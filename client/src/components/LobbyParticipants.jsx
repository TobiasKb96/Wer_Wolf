import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

//TODO option to kick players that joined
//TODO start game button
//TODO start game button is clickable when 4 players are in the lobby




const LobbyParticipants = ({ sessionId }) => {
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const backendUrl = window.__BACKEND_URL__;

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/lobby/${sessionId}`);
                setParticipants(response.data.participants);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch participants.');
                console.error(err);
                setLoading(false);
            }
        };

        fetchParticipants();

        const interval = setInterval(fetchParticipants, 5000);
        return () => clearInterval(interval);
    }, [sessionId]);

    if (loading)
        return <div className="text-center mt-4">Loading participants...</div>;
    if (error)
        return <div className="text-red-500 text-center mt-4">{error}</div>;

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
                            {participant}
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

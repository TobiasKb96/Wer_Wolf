import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

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

    if (loading) return <div style={{ textAlign: 'center', marginTop: '1rem' }}>Loading participants...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>{error}</div>;

    return (
        <div
            style={{
                margin: '2rem auto',
                padding: '1rem',
                maxWidth: '400px',
                backgroundColor: '#f9f9f9',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
        >
            <h2 style={{ textAlign: 'center', color: '#646cff', marginBottom: '1rem' }}>Active Participants</h2>
            {participants.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {participants.map((participant, index) => (
                        <li
                            key={index}
                            style={{
                                padding: '0.5rem 1rem',
                                marginBottom: '0.5rem',
                                backgroundColor: '#e8e8ff',
                                borderRadius: '5px',
                                color: '#333',
                                textAlign: 'center',
                            }}
                        >
                            {participant}
                        </li>
                    ))}
                </ul>
            ) : (
                <p style={{ textAlign: 'center', color: '#333' }}>No participants yet.</p>
            )}
        </div>
    );
};

LobbyParticipants.propTypes = {
    sessionId: PropTypes.string.isRequired,
};

export default LobbyParticipants;

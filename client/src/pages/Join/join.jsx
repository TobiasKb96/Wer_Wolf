import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './join.css';

function Join() {
    const { sessionId } = useParams(); // Extract sessionId from the URL
    const [name, setName] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const backendUrl = window.__BACKEND_URL__;

    const handleJoinLobby = async () => {
        if (!name.trim()) {
            setError('Please enter your name.');
            return;
        }

        try {
            await axios.post(`${backendUrl}/api/join-lobby`, { name, sessionId });
            setSuccess(true);
            setError(null);
        } catch (err) {
            console.error('Failed to join the lobby:', err);
            setError(err.response?.data?.error || 'Unable to join the lobby. Please try again.');
        }
    };

    return (
        <div className="join-container">
            <h1>Join Game</h1>
            <p>Session ID: <strong>{sessionId}</strong></p>
            <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="join-input"
            />
            <button onClick={handleJoinLobby} className="join-button">
                Join Lobby
            </button>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">Successfully joined the lobby!</p>}
        </div>
    );
}

export default Join;

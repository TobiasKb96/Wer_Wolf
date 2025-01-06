import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Player from "../Game/gamelogic/Player.js";

//TODO M10.	The system shall allow players to choose their name when joining a lobby -> works?
//TODO use player from parent

function Join({setPlayer}) {
    const { sessionId } = useParams();
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

           const newPlayer = new Player(name);
           setPlayer(newPlayer);

            setSuccess(true);
            setError(null);
        } catch (err) {
            console.error('Failed to join the lobby:', err);
            setError(err.response?.data?.error || 'Unable to join the lobby. Please try again.');
        }
    };

    return (
        <div className="text-center mt-8 p-4">
            <h1 className="text-[#646cff] mb-4 text-2xl font-bold">Join Game</h1>
            <p>Session ID: <strong>{sessionId}</strong></p>
            <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-4/5 max-w-[300px] p-2 my-4 text-base border border-gray-300 rounded-md"
            />
            <button
                onClick={handleJoinLobby}
                className="px-6 py-3 text-lg text-white bg-blue-600 rounded-md transition-colors hover:bg-blue-700"
            >
                Join Lobby
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {success && (
                <div className="text-green-500 mt-4">
                    <p>Successfully joined the lobby!</p>
                </div>
            )}
        </div>
    );
}

export default Join;

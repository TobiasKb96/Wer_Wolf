import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LobbyParticipants from "../../components/LobbyParticipants.jsx";
import socket from '../../utils/socket'; // Import the initialized Socket.IO client
import Player from "../Game/gamelogic/Player.js";
import gameState from "../Game/gamelogic/gameState.js";
import player from "../Game/gamelogic/Player.js";

//TODO M10.	The system shall allow players to choose their name when joining a lobby -> works?
//TODO use participant instead of player

function Join({setPlayer}) {
    const { sessionId } = useParams();
    const [name, setName] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const playerJoinedSuccessfullyHandler = (data) => {
            setSuccess(true);
            setError(null);
            console.log('Player joined:', data);
        };

        const errorHandler = (errMsg) => {
            setError(errMsg);
            console.error('Error joining lobby:', errMsg);
        };

        const gameStartedHandler = (user) => {
            console.log('Game started');
            console.log(user);
            let playerList = [];
            let player = new Player(user.name, user.role)
            setPlayer(player)
            playerList.push(player);
            console.log(new Player(user.name, user.role))
            //switch to game.jsx here
            navigate('/game');
        };

        // Set up listeners
        socket.on('playerJoinedSuccessfully', playerJoinedSuccessfullyHandler);
        socket.on('JoinError', errorHandler);
        socket.on('gameStarted', gameStartedHandler);

        return () => {
            // Clean up listeners
            socket.off('playerJoinedSuccessfully', playerJoinedSuccessfullyHandler);
            socket.off('JoinError', errorHandler);
            socket.off('gameStarted', gameStartedHandler);
        };
    }, []);

    const handleJoinLobby = () => {
        if (!name.trim()) {
            setError('Please enter your name.');
            return;
        }
        socket.emit('joinLobby', { sessionId, name });

        gameState.addPlayer(name); // checkif correct here
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
            {success && <p className="text-green-500 mt-4">Successfully joined the lobby!</p>}
            {success && (
                <div>
                    <LobbyParticipants sessionId={sessionId} />
                </div>
            )}
        </div>
    );
}

export default Join;

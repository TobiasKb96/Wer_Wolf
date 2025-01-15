import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import LobbyParticipants from '../../components/LobbyParticipants';
import socket from '../../utils/socket';

function Home({ setJoinedLobbyParticipants }) {
    const [qrCode, setQrCode] = useState(null); // State for QR Code
    const [sessionId, setSessionId] = useState(null); // State for confirmed session ID
    const [sessionLink, setSessionLink] = useState(null); // State for session link
    const backendUrl = window.__BACKEND_URL__; // Backend URL
    const navigate = useNavigate();

    useEffect(() => {
        const gameCreatedHandler = async ({ sessionId }) => {
            setSessionId(sessionId);

            // Generate QR code
            const sessionUrl = `${backendUrl}/join/${sessionId}`; // Adjust URL as needed
            setSessionLink(sessionUrl);
            const qrCodeImg = await QRCode.toDataURL(sessionUrl);
            setQrCode(qrCodeImg);
        };

        const errorHandler = (err) => {
            console.error("Error creating game:", err);
        };

        const gameStartedForNarratorHandler = (playersInSession) => {
            console.log("Lobby Data ", playersInSession);
            setJoinedLobbyParticipants(playersInSession);
            navigate('/narrator');
        };

        // Set up listeners
        socket.on("gameCreated", gameCreatedHandler);
        socket.on("error", errorHandler);
        socket.on("gameStartedForNarrator", gameStartedForNarratorHandler);

        return () => {
            // Clean up listeners
            socket.off("gameCreated", gameCreatedHandler);
            socket.off("error", errorHandler);
            socket.off("gameStartedForNarrator", gameStartedForNarratorHandler);
        };
    }, []);

    const handleNewGame = () => {
        socket.emit("createGame");
    };

    const startGame = () => {
        if (sessionId) {
            socket.emit("startGame", sessionId);
        } else {
            console.error("Cannot start game without session ID");
        }
    };

    return (
        <div className="text-center p-8">
            {/* Create Game Button */}
            <button
                onClick={handleNewGame}
                className="px-8 py-4 text-base text-white bg-blue-600 rounded-lg cursor-pointer mb-4 transition-colors hover:bg-blue-700"
            >
                Create New Game
            </button>

            {/* Display QR Code and Active Participants */}
            {qrCode && (
                <div className="flex justify-center items-start gap-8 mt-8">
                    {/* QR Code Section */}
                    <div className="text-center border border-gray-300 p-4 rounded-lg bg-gray-100 shadow-md">
                        <img
                            src={qrCode}
                            alt="QR Code for New Game"
                            className="w-48 h-48 mb-4"
                        />
                        <p>Scan the QR code to join the game!</p>
                        {sessionLink && (
                            <p className="text-blue-600 underline">
                                <a href={sessionLink} target="_blank" rel="noopener noreferrer">
                                    {sessionLink}
                                </a>
                            </p>
                        )}
                    </div>

                    {/* Active Participants Section */}
                    <LobbyParticipants sessionId={sessionId} />
                </div>
            )}

            {/* Start Game Button */}
            {qrCode && (
                <button
                    onClick={startGame}
                    className="px-8 py-4 mt-4 text-base text-white bg-green-600 rounded-lg cursor-pointer transition-colors hover:bg-green-700"
                >
                    Start Game
                </button>
            )}
        </div>
    );
}

export default Home;

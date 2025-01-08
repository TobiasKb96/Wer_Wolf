import { useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import QRCode from 'qrcode';
import LobbyParticipants from '../../components/LobbyParticipants';
import socket from '../../utils/socket'; // Import the initialized Socket.IO client

//TODO M1. The system shall provide the users with the ability to play a game of Werewolf with a narrator.
//TODO M2. The system shall provide the user with a one time login QR code for the players to enter the game session.
//TODO M4. The system shall assign random roles to the users entering the game
//TODO ad.M4 bis 5 spieler in der Lobby 1 Werewolf darueber 2
//TODO CX depends on setup options, pick how many player should be werewolves
//TODO M9.	The system shall be able to distribute player roles between up to 8 players per game session.

function Home() {
    const [qrCode, setQrCode] = useState(null); // State for QR Code
    const [sessionId, setSessionId] = useState(null); // State for confirmed session ID
    const [sessionLink, setSessionLink] = useState(null); // State for session link
    const backendUrl = window.__BACKEND_URL__; // Backend URL
    const navigate = useNavigate();

    // Socket event listeners
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

        const gameStartedForNarratorHandler = () => {
            navigate('/narrator');
        }

        // Set up listeners
        socket.on("gameCreated", gameCreatedHandler);
        socket.on("error", errorHandler);
        socket.on("gameStartedForNarrator", gameStartedForNarratorHandler)

        return () => {
            // Clean up listeners
            socket.off("gameCreated", gameCreatedHandler);
            socket.off("error", errorHandler);
            socket.off("gameStartedForNarrator", gameStartedForNarratorHandler)
        };
    }, []);

    const handleNewGame = () => {
        socket.emit("createGame");
    };

    const startGame = () => {
        socket.emit("startGame",sessionId);
    };

    return (
        <div className="text-center p-8">
            <button
                onClick={handleNewGame}
                className="px-8 py-4 text-base text-white bg-blue-600 rounded-lg cursor-pointer mb-4 transition-colors hover:bg-blue-700"
            >
                Create New Game
            </button>

            {/* Display QR Code and Active Participants Side-by-Side */}
            {qrCode && (
                <div className="flex justify-center items-start gap-8 mt-8">
                    {/* QR Code */}
                    <div className="text-center border border-gray-300 p-4 rounded-lg bg-gray-100 shadow-md">
                        <div className="flex justify-center">
                            <img
                                src={qrCode}
                                alt="QR Code for New Game"
                                className="w-48 h-48 mb-4"
                            />
                        </div>
                        <p>Scan the QR code to join the game!</p>
                        {/* Display Session Link */}
                        {sessionLink && (
                            <p className="text-blue-600 underline">
                                <a href={sessionLink} target="_blank" rel="noopener noreferrer">
                                    {sessionLink}
                                </a>
                            </p>
                        )}
                    </div>

                    {/* Active Participants */}
                    {sessionId && <div><LobbyParticipants sessionId={sessionId} /></div>}
                </div>
            )}
            {/* Start Game Button */}
            {LobbyParticipants.length > 0 && (
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

import { useState } from 'react';
import axios from "axios";
import QRCode from 'qrcode';
import LobbyParticipants from '../../components/LobbyParticipants';

function Home() {
    const [qrCode, setQrCode] = useState(null);           // State for QR Code
    const [sessionId, setSessionId] = useState(null);     // State for confirmed session ID

    const backendUrl = window.__BACKEND_URL__;            // Backend URL

    const handleNewGame = async () => {
        try {
            // API call to create a new game
            const response = await axios.post(`${backendUrl}/api/new-game`);

            // Set session ID
            const confirmedSessionId = response.data.sessionId;
            setSessionId(confirmedSessionId);

            // Generate QR code
            const qrCodeData = await QRCode.toDataURL(`${backendUrl}/join/${confirmedSessionId}`);
            console.log("QR Code URL:", qrCodeData); // Debugging
            setQrCode(qrCodeData);
        } catch (error) {
            console.error("Failed to create a new game:", error);
        }
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
                        <img src={qrCode} alt="QR Code for New Game" className="w-48 h-48 mb-4" />
                        <p>Scan the QR code to join the game!</p>
                    </div>

                    {/* Active Participants */}
                    {sessionId && (
                        <div className="w-72 p-4 border border-gray-300 rounded-lg bg-gray-100 shadow-md">
                            <LobbyParticipants sessionId={sessionId} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Home;

import { useState } from 'react';
import './home.css';
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
        <div className="main-content">
            <button onClick={handleNewGame} className="new-game-button">
                Create New Game
            </button>

            {/* Display QR Code and Active Participants Side-by-Side */}
            {qrCode && (
                <div className="qr-code-and-participants">
                    {/* QR Code */}
                    <div className="qr-code-container">
                        <img src={qrCode} alt="QR Code for New Game" />
                        <p>Scan the QR code to join the game!</p>
                    </div>

                    {/* Active Participants */}
                    {sessionId && (
                        <div className="participants-container">
                            <LobbyParticipants sessionId={sessionId} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Home;

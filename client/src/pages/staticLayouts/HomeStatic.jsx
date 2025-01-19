import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import LobbyParticipants from '../../components/LobbyParticipants';
import socket from '../../utils/socket'; // Import the initialized Socket.IO client
import gameController from "../Game/gamelogic/gameController.js";
import GameOptions from "../../components/GameOptions.jsx";

console.log(socket.id)
function HomeStatic({setJoinedLobbyParticipants, setSelectedRoles}) {
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
        <div
            className="flex overflow-hidden flex-col px-1.5 pb-2 mx-auto w-full h-full text-center text-black bg-yellow-950 ">
            <div
                className="flex overflow-hidden flex-col items-center h-full pt-0 pb-20 mt-1.5 border-2 border-solid bg-zinc-300 border-stone-600">
                <div
                    className="overflow-visible self-stretch px-8 py-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl whitespace-nowrap rounded-b-xl border-solid bg-stone-300 border-neutral-500 shadow-[0px_2px_2px_rgba(0,0,0,0.25)] font-metal">
                    Wer?Wolf
                </div>
                <div className="mt-20">
                    Have you seen this wolf?
                </div>
                <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/7bc200703c17522024c30af85dfbbc318d63fe4394ede377db6f091f06d50f94?placeholderIfAbsent=true&apiKey=4207de095666434880eb8ceb2ef5bac3"
                    alt="Werewolf portrait"
                    className="object-contain mt-6 w-60 max-w-full aspect-[0.96] rounded-[215px]"
                />
                <div
                    className="mt-7"
                >
                    Notify authorities now
                </div>
                <button
                    onClick={handleNewGame}
                    className="mt-4 px-6 py-3 text-lg text-white bg-yellow-800 rounded-md transition-colors hover:bg-yellow-900">

                    Create New Game
                </button>
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

                <GameOptions setSelectedRoles={setSelectedRoles} />

                {/* Start Game Button */}
                {qrCode && (
                    <button
                        onClick={startGame}
                        className="px-8 py-4 mt-4 text-base text-white bg-green-600 rounded-lg cursor-pointer transition-colors hover:bg-green-700"
                    >
                        Start Game
                    </button>
                )}
                <button
                    className="mt-4 px-6 py-3 text-lg text-white bg-yellow-800 rounded-md transition-colors hover:bg-yellow-900">

                    Learn more
                </button>
            </div>
        </div>
    );

}

export default HomeStatic;

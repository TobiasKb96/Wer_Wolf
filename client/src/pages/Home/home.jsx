import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import QRCode from 'qrcode';
import LobbyParticipants from '../../components/LobbyParticipants';
import socket from '../../utils/socket'; // Import the initialized Socket.IO client
import gameController from "../Game/gamelogic/gameController.js";
import GameOptions from "../../components/GameOptions.jsx";

console.log(socket.id)

//TODO M1. The system shall provide the users with the ability to play a game of Werewolf with a narrator.
//TODO M2. The system shall provide the user with a one time login QR code for the players to enter the game session.
//TODO M4. The system shall assign random roles to the users entering the game
//TODO CX depends on setup options, pick how many player should be werewolves
//TODO M9.	The system shall be able to distribute player roles between up to 8 players per game session.
//TODO user shall be able to choose between human narrator or computed


function Home({setJoinedLobbyParticipants, setSelectedRoles}) {
    const [qrCode, setQrCode] = useState(null); // State for QR Code
    const [sessionId, setSessionId] = useState(null); // State for confirmed session ID
    const [sessionLink, setSessionLink] = useState(null); // State for session link
    const backendUrl = window.__BACKEND_URL__; // Backend URL
    const navigate = useNavigate();
    const [showRules, setShowRules] = useState(true);

    useEffect(() => {
        const gameCreatedHandler = async ({sessionId}) => {
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
        setShowRules(false);
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
                <div
                    className={`transition-all duration-700 ease-in-out overflow-auto ${
                        showRules ? "max-h-100 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                    <p className="mt-4 text-lg px-4">
                        Welcome to the thrilling world of Werewolf, where deception, deduction, and teamwork will
                        determine your survival. In this game, players are assigned secret roles and divided into two
                        factions: Villagers and Werewolves. Each night, the Werewolves plot their next victim, while the
                        Villagers work together during the day to uncover the Werewolves’ identities.
                    </p>
                    <ul className="mt-2 text-left px-6 list-disc overflow-scroll">
                        <li>Villagers: Work together to identify and eliminate all Werewolves before they overpower the
                            village.
                        </li>
                        <li>Werewolves: Deceive and eliminate enough Villagers to take control of the village.</li>
                        <li>Witch: A Villager with two powerful potions: one to save a player from being eliminated at
                            night and another to eliminate a player of their choice. Each potion can be used only once,
                            so choose carefully.
                        </li>
                        <li>Bodyguard: A Villager who can protect one player from being eliminated each night. The
                            Bodyguard cannot protect the same player two nights in a row.
                        </li>
                        <li>Cupid: On the first night, Cupid selects two players to become Lovers. If one Lover is
                            eliminated, the other dies of heartbreak. If the Lovers belong to different factions, they
                            must secretly work together to survive until the end.
                        </li>
                        <li>Girl: A Villager with the ability to peek during the Werewolves’ secret meetings. Be
                            careful, though—if the Werewolves notice you spying, they may eliminate you next.
                        </li>
                        <li>Hunter: A Villager with a deadly instinct. If the Hunter is eliminated, they can take one
                            player down with them. Choose wisely.
                        </li>
                        <li>Seer: A Villager with a special ability. Each night, the Seer can secretly learn the role of
                            one player. Use this knowledge wisely to guide the Villagers without revealing your identity
                            too soon.
                        </li>
                    </ul>
                </div>


                <h1 className="text-2xl font-bold mt-4 mb-6">New Game</h1>

                {/* Create Game Button */}
                <button
                    onClick={handleNewGame}
                    className="px-8 py-4 text-base text-white bg-blue-600 rounded-lg cursor-pointer mb-6 transition-colors hover:bg-blue-700"
                >
                    Create New Game
                </button>

                {/* Main Content */}
                {qrCode && (
                    <div className="flex flex-wrap justify-center items-start gap-6 mt-6">
                        {/* QR Code Section */}
                        <div
                            className="max-w-sm text-center border border-gray-300 p-4 rounded-lg bg-gray-100 shadow-md">
                            <h2 className="font-bold text-lg mb-4">Join the Game</h2>
                            <img
                                src={qrCode}
                                alt="QR Code for New Game"
                                className="w-48 h-48 mb-4"
                            />
                            <p>Scan the QR code to join the game!</p>
                            {sessionLink && (
                                <p className="text-blue-600 underline mt-2">
                                    <a href={sessionLink} target="_blank" rel="noopener noreferrer">
                                        {sessionLink}
                                    </a>
                                </p>
                            )}
                        </div>

                        {/* Active Players Section */}
                        <div className="max-w-sm border border-gray-300 p-4 rounded-lg bg-gray-100 shadow-md">
                            <h2 className="font-bold text-lg mb-4">Active Players</h2>
                            <LobbyParticipants sessionId={sessionId}/>
                        </div>

                        {/* Game Options Section */}
                        <div className="max-w-sm border border-gray-300 p-2 rounded-lg bg-gray-100 shadow-md">
                            <h2 className="font-bold text-lg mb-4">Game Options</h2>
                            <GameOptions setSelectedRoles={setSelectedRoles}/>
                        </div>
                    </div>
                )}

                {/* Start Game Button */}
                {qrCode && (
                    <button
                        onClick={startGame}
                        className="px-8 py-4 mt-6 text-base text-white bg-green-600 rounded-lg cursor-pointer transition-colors hover:bg-green-700"
                    >
                        Start Game
                    </button>
                )}
            </div>
        </div>
    );


}

export default Home;

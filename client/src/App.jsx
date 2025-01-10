import React, { useState, Suspense } from "react";
import { Routes, Route, Link } from "react-router-dom";
//import routes from "./utils/routes";
import adapter from 'webrtc-adapter';
import Game from "./pages/Game/game.jsx";
import Narrator from "./pages/narrator/narrator.jsx";
import Home from "./pages/Home/home.jsx";
import Join from "./pages/Join/join.jsx";
import Basic from "./pages/Vite_react_basic/basic.jsx";
import Player from "./pages/Game/gamelogic/Player.js";

//TODO player state

function App() {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [ownSocketId, setOwnSocketId] = useState(null);
    const [joinedLobbyParticipants, setJoinedLobbyParticipants] = useState([]);


    const toggleSidebar = () => {
        setSidebarVisible((prev) => !prev);
    };

    // Static routes array
    const staticRoutes = [
        { path: "/", name: "Home", component: <Home setJoinedLobbyParticipants={setJoinedLobbyParticipants} /> },
        { path: "/join/:sessionId", name: "Join", component: <Join setOwnSocketId={setOwnSocketId} /> },
        { path: "/game", name: "Game", component: <Game ownSocketId={ownSocketId} /> },
        { path: "/narrator", name: "Narrator", component: <Narrator joinedLobbyParticipants={joinedLobbyParticipants}/> },
        { path: "/basic_test", name: "Basic Test", component: <Basic /> },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Hamburger Button */}
            <button
                className="fixed top-4 left-4 bg-blue-500 text-white text-2xl rounded p-2 z-50 hover:bg-blue-600"
                onClick={toggleSidebar}
            >
                ☰
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 w-64 h-screen bg-gray-800 text-white p-5 shadow-lg transition-transform transform ${
                    sidebarVisible ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <h2 className="text-2xl font-bold mb-4">Available Pages</h2>
                <ul className="space-y-2">
                    {staticRoutes.map((route, index) => (
                        <li key={index}>
                            <Link
                                to={route.path}
                                onClick={() => setSidebarVisible(false)}
                                className="block px-3 py-2 rounded hover:bg-gray-600"
                            >
                                {route.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Main Content */}
            <main
                className={`flex-1 p-5 transition-all ${
                    sidebarVisible ? "ml-64" : "ml-0"
                }`}
            >
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        {staticRoutes.map((route, index) => (
                            <Route
                                key={index}
                                path={route.path}
                                element={route.component}
                            />
                        ))}
                    </Routes>
                </Suspense>
            </main>
        </div>
    );
}

export default App;

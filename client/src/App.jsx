import React, { useState, Suspense } from "react";
import { Routes, Route, Link } from "react-router-dom";
import routes from "./utils/routes";
import adapter from 'webrtc-adapter';
import Game from "./pages/Game/game.jsx";
import Join from "./pages/Join/join.jsx";

//TODO player state

function App() {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [player, setPlayer] = useState(null)

    const toggleSidebar = () => {
        setSidebarVisible((prev) => !prev);
    };


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
                    {routes.map((route, index) => (
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
                        {routes.map((route, index) => (
                            <Route
                                key={index}
                                path={route.path}
                                element={<route.component />}
                            />
                        ))}
                        {/* Manually Defined Routes */}
                        <Route path="/join/:sessionId" element={<Join setPlayer={setPlayer} />} />
                    </Routes>
                </Suspense>
            </main>
        </div>
    );
}

export default App;

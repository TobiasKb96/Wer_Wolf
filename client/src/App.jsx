import React, { useState, Suspense } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import routes from './utils/routes';
import './App.css';

function App() {
    const [sidebarVisible, setSidebarVisible] = useState(false);

    const toggleSidebar = () => {
        setSidebarVisible((prev) => !prev);
    };

    return (
        <div className="app-container">
            {/* Hamburger Button */}
            <button className="hamburger" onClick={toggleSidebar}>
                ☰
            </button>

            {/* Sidebar */}
            <aside className={`sidebar ${sidebarVisible ? 'visible' : 'hidden'}`}>
                <h2>Available Pages</h2>
                <ul>
                    {routes.map((route, index) => (
                        <li key={index}>
                            <Link to={route.path} onClick={() => setSidebarVisible(false)}>
                                {route.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Main Content */}
            <main className={`main-content ${sidebarVisible ? 'sidebar-hidden' : ''}`}>
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        {routes.map((route, index) => (
                            <Route key={index} path={route.path} element={<route.component />} />
                        ))}
                    </Routes>
                </Suspense>
            </main>
        </div>
    );
}

export default App;

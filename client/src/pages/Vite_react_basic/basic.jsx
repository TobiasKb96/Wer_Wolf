import { useState } from "react";
import axios from "axios";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function Basic() {
    const [count, setCount] = useState(0);
    const [array, setArray] = useState([]);
    const backendUrl = window.__BACKEND_URL__; // Assume your backend URL is set globally

    const fetchAPI = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/example`);
            setArray(response.data.fruits); // Assuming the response contains a `fruits` array
        } catch (error) {
            console.error("Error fetching API:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200">
            <div className="flex space-x-4 mb-6">
                <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
                    <img
                        src={viteLogo}
                        className="w-24 h-24 transition-transform hover:scale-110"
                        alt="Vite logo"
                    />
                </a>
                <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
                    <img
                        src={reactLogo}
                        className="w-24 h-24 transition-transform hover:scale-110"
                        alt="React logo"
                    />
                </a>
            </div>
            <h1 className="text-4xl font-bold mb-6">Vite + React</h1>
            <div className="card bg-gray-800 p-6 rounded-lg shadow-md">
                <button
                    onClick={() => setCount((count) => count + 1)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg mb-4"
                >
                    Count is {count}
                </button>
                <button
                    onClick={fetchAPI}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg mb-4"
                >
                    API test fruits
                </button>
                {array.map((fruit, index) => (
                    <p key={index} className="bg-gray-700 py-2 px-4 rounded-lg mb-2">
                        {fruit}
                    </p>
                ))}
                <p className="text-gray-400 mt-4">
                    Edit <code className="bg-gray-700 px-1 rounded">src/App.jsx</code> and save to test HMR
                </p>
            </div>
            <p className="mt-8 text-sm text-gray-500">
                Click on the Vite and React logos to learn more
            </p>
        </div>
    );
}

export default Basic;

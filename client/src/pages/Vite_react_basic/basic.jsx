import {useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './basic.css'
import axios from "axios";

function Basic() {
    const [count, setCount] = useState(0)
    const [array, setArray] = useState([])
    const backendUrl = window.__BACKEND_URL__;
    const fetchAPI = async () => {
        const response = await axios.get(`${backendUrl}/api/example`)
        console.log(response.data.fruits)
        setArray(response.data.fruits)
    }


    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo"/>
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo"/>
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <button onClick={() => fetchAPI()}>
                    API test fruits are
                </button>
                {array.map((fruit, index) =>
                    <div key={fruit} style={{marginBottom: '16px'}}>
                        <p>{fruit}</p>
                    </div>
                )}
                <p>
                    Edit <code>src/App.jsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    )
}

export default Basic

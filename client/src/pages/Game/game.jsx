import Join from "../Join/join.jsx";
import {useState, useEffect} from "react";
import io from "socket.io-client";
import adapter from 'webrtc-adapter';

const signalUrl = window.__SIGNAL_URL__;
const socket = io.connect(`${signalUrl}`, {
    rejectUnauthorized: false
})
console.log(`connected to ${signalUrl}`)

useState(()=>{
   navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    })
},[])
function Game(){


    return (
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Button
    </button>
    )

}

export default Game;
import Join from "../Join/join.jsx";
import {useState, useEffect} from "react";
import io from "socket.io-client";
import adapter from 'webrtc-adapter';

const signalUrl = window.__SIGNAL_URL__;

const socket = io.connect(`${signalUrl}`, {
    rejectUnauthorized: false
})
console.log(`connected to ${signalUrl}`)

//TODO Anna

//TODO show your own role, (all players that are not the narrator, are on this page)
//TODO should: show timers, inform player if he died, allow players to choose a player to chat to during daytime (insert chat component)

//TODO M5. The system shall provide 2 playable characters, werewolf.js and villager
//TODO M6. The system shall manage game phases to differentiate between day and night.
//TODO M7. The system shall provide the narrator with an overview of the characters of the players.
//TODO M8.	The system shall display the narrator’s script, including all necessary prompts and instructions, on the narrator’s device.

useState(()=>{
   navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    })
},[])
function Game(){


    return (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Button
    </button>
    )

}

export default Game;
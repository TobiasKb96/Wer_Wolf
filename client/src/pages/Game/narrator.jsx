import Join from "../Join/join.jsx";
import {useState, useEffect} from "react";
import io from "socket.io-client";
import adapter from 'webrtc-adapter';

//TODO Steffi

//TODO show names of all participants and their roles
//TODO provide instructions for phases
//TODO provide buttons to transition phases/end game
//TODO should: provide timers, Narrator has option to kill players (this allows to keep track of who is alive, so the script changes accordingly)
//TODO

function Narrator(){


    return (
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Hello im a Button
        </button>
    )

}

export default Narrator;
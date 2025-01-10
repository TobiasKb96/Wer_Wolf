// client/src/utils/socket.js
import { io } from 'socket.io-client';

const backendUrl = window.__BACKEND_URL__;

console.log(backendUrl)

const socket = io.connect(`${backendUrl}`, {
    rejectUnauthorized: false
})


export default socket;



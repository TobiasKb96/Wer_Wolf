//TODO M3.	The system shall be accessible through a web server without requiring downloads or an app.

const express = require("express");
const path = require("path");
const cors = require("cors")
const https = require('https')
const os = require('os');
const socketio = require('socket.io')
const fs = require("fs");

const PORT =  8080;
const SIGNALPORT = 8081;

const app = express();

const key = fs.readFileSync('./certs/cert.key')
const cert = fs.readFileSync('./certs/cert.crt')

app.use(express.json());

//all routes

const newGameRoute = require('./routes/newGame');
const exampleRoute = require('./routes/reactExample');


//TODO differntiate WLAN & LAN adapter
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal && iface.address.startsWith('192.168')) {
                return iface.address; // Return the 192.168.x.x IP
            }
        }
    }
    return 'localhost'; // Fallback if no IP is found
}
const LOCAL_IP = getLocalIP(); // Dynamically find the local IP

app.use(cors());

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, "../client/build")));


app.use('/api', exampleRoute);
app.use('/api', newGameRoute);

// Catch-all route to serve React index.html for React Router
app.get('/config.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.send(`
        window.__BACKEND_URL__ = "https://${LOCAL_IP}:${PORT}";
        window.__SIGNAL_URL__ = "https://${LOCAL_IP}:${PORT}";
    `);

});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

const secureExpressServer = https.createServer({key,cert},app)

// Start the server
secureExpressServer.listen(PORT, LOCAL_IP, () => {
    console.log(`Server running on https://${LOCAL_IP}:${PORT}`);
});


//signalling server start

const io = socketio(secureExpressServer, {
    cors: {
        origin: "*", // Allow all origins
        methods: ["GET", "POST"], // Allow necessary methods
    },
});

const handlersPath = path.join(__dirname, 'socketHandlers');
fs.readdirSync(handlersPath).forEach((file) => {
    const handler = require(path.join(handlersPath, file));
    io.on('connection', (socket) => {
        handler(io, socket);
    });
});



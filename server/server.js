const express = require("express");
const path = require("path");
const cors = require("cors")
const os = require('os');


const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json());

//all routes

const newGameRoute = require('./routes/newGame');
const exampleRoute = require('./routes/reactExample');

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
    res.send(`window.__BACKEND_URL__ = "http://${LOCAL_IP}:${PORT}";`);
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});


// Start the server
app.listen(PORT, LOCAL_IP, () => {
    console.log(`Server running on http://${LOCAL_IP}:${PORT}`);
});

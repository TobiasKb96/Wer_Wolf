const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid'); // Import UUID library

const activeSessions = new Map(); // Use Map to store sessions and participants

// Route to create a new game session
router.post('/new-game', (req, res) => {
    // Generate a random session ID
    const sessionId = uuidv4();

    // Initialize an empty participant list for the session
    activeSessions.set(sessionId, []);

    // Respond with the generated session ID
    res.json({ sessionId });
});

// Route to join a lobby
router.post('/join-lobby', (req, res) => {
    const { name, sessionId } = req.body;

    // Validate input
    if (!name || !sessionId) {
        return res.status(400).json({ error: 'Name and Session ID are required.' });
    }

    // Check if the session exists
    if (!activeSessions.has(sessionId)) {
        return res.status(404).json({ error: 'Session does not exist.' });
    }

    // Add the user to the session's participant list
    const participants = activeSessions.get(sessionId);
    participants.push(name);
    activeSessions.set(sessionId, participants);


    // Respond with success and updated participant list
    res.json({
        message: `${name} successfully joined session ${sessionId}.`,
        participants,
    });
});

router.get('/lobby/:sessionId', (req, res) => {
    const { sessionId } = req.params;

    if (!activeSessions.has(sessionId)) {
        return res.status(404).json({ error: 'Session not found.' });
    }

    const participants = activeSessions.get(sessionId);
    res.json({ participants });
});

module.exports = router;

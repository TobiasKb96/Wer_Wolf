const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, "../client/build")));

// API route example
app.get("/api", (req, res) => {
    res.json({ fruits: ["apple", "banana", "orange"] });
});

// Catch-all route to serve React index.html for React Router
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

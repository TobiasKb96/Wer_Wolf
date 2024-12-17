const express = require('express');
const router = express.Router();


// API route example
router.get("/example", (req, res) => {
    res.json({ fruits: ["apple", "banana", "orange"] });
});

module.exports = router;

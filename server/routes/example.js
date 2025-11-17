const express = require('express');
const router = express.Router();

// Example GET endpoint
router.get('/', (req, res) => {
  res.json({ message: 'This is your first API response!' });
});

// Example POST endpoint
router.post('/', (req, res) => {
  const data = req.body;
  res.json({ received: data });
});

module.exports = router;

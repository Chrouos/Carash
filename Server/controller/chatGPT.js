const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Get all users');
});

router.get('/:id', (req, res) => {
  const userId = req.params.id;
  res.send(`Get user with ID ${userId}`);
});

// Export the router
module.exports = router;

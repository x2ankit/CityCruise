const express = require('express');
const router = express.Router();
const { googleAuthController } = require('../controllers/authController');

// POST /auth/google
// body: { idToken: string, role?: 'user'|'captain' }
router.post('/google', googleAuthController);

module.exports = router;

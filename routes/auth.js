// auth.js
// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.delete('/delete', authController.deleteAccount);
router.get('/me', authController.me);

module.exports = router;

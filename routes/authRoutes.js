const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// GET
router.get('/login', authController.getLogin);
router.get('/register', authController.getRegister);

// POST
router.post('/login', authController.postLogin);
router.post('/register', authController.postRegister);

// Logout
router.get('/logout', authController.logout);

module.exports = router;

const express = require('express');
const router = express.Router();

// Define user dashboard routes
router.get('/history', (req, res) => res.render('user/history'));
router.get('/library', (req, res) => res.render('user/library'));
router.get('/my-addresses', (req, res) => res.render('user/myAddresses'));
router.get('/security', (req, res) => res.render('user/security'));
router.get('/payments', (req, res) => res.render('user/payments'));
router.get('/resell', (req, res) => res.render('user/resell'));

module.exports = router;

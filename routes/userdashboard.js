const express = require('express');
const router = express.Router();

router.get('/history', (req, res) => res.render('dashboard/user/history'));
router.get('/library', (req, res) => res.render('dashboard/user/library'));
router.get('/myAddresses', (req, res) => res.render('dashboard/user/myAddresses'));
router.get('/security', (req, res) => res.render('dashboard/user/security'));
router.get('/payments', (req, res) => res.render('dashboard/user/payments'));
router.get('/resell', (req, res) => res.render('dashboard/user/resell'));

module.exports = router;

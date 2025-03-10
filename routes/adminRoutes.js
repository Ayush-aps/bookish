// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin dashboard
router.get('/', adminController.adminDashboard);

// Approve existing "seller" -> "approvedSeller"
router.post('/approve-seller', adminController.approveSeller);

// Remove user or seller or approvedSeller
router.post('/remove-user', adminController.removeUser);

module.exports = router;

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// User dashboard
router.get('/user', (req, res) => {
  if (req.session.user.role !== 'user') {
    return res.status(403).render('error', { message: 'Access denied' });
  }
  dashboardController.userDashboard(req, res);
});

// Seller dashboard (for "seller" role)
router.get('/seller', (req, res) => {
  if (req.session.user.role !== 'seller') {
    return res.status(403).render('error', { message: 'Access denied' });
  }
  dashboardController.sellerDashboard(req, res);
});

// Approved Seller dashboard (for "approvedSeller" role)
router.get('/approvedseller', (req, res) => {
  if (req.session.user.role !== 'approvedSeller') {
    return res.status(403).render('error', { message: 'Access denied' });
  }
  dashboardController.approvedSellerDashboard(req, res);
});

module.exports = router;
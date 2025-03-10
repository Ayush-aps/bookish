const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// View cart
router.get('/', cartController.viewCart);

// Add to cart
router.post('/add', (req, res) => {
  // 1. Check if user is logged in
  if (!req.session.user) {
    // Option A: Redirect to login
    return res.redirect('/login');
    // Option B: Or show an error page:
    // return res.status(401).render('error', { message: 'You must be logged in to add items to cart.' });
  }

  // 2. If logged in, call your controller logic
  cartController.addToCart(req, res);
});

// Remove from cart
router.post('/remove', cartController.removeFromCart);

module.exports = router;

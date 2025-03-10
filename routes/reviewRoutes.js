const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Infinite scroll page
router.get('/', reviewController.viewReviews);

// API to fetch reviews in pages
router.get('/api', reviewController.getReviewsByPage);

// Post a new review
router.post('/', reviewController.createReview);

module.exports = router;

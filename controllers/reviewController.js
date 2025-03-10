const reviewModel = require('../models/reviewModel');

exports.viewReviews = (req, res) => {
  // Renders the EJS page that loads reviews via JS
  res.render('reviews/reviews');
};

exports.getReviewsByPage = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const reviews = reviewModel.getReviewsByPage(page, limit);
  res.json({ reviews });
};

exports.createReview = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { bookId, text } = req.body;
  reviewModel.createReview({
    bookId,
    userId: req.session.user.id,
    text
  });
  res.redirect('/reviews');
};

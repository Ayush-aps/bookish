// routes/bookRoutes.js

const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// List all books
router.get('/', bookController.listBooks);

// Add a new book
router.route('/add')
  .get((req, res, next) => {
    // Must be "approvedSeller" or "admin"
    if (!req.session.user || !['approvedSeller', 'admin'].includes(req.session.user.role)) {
      return res.status(403).render('error', { message: 'Access denied. Must be approved seller or admin.' });
    }
    next();
  }, bookController.addBook)
  .post(bookController.addBook);

// Book detail
router.get('/:id', bookController.getBookDetail);

// Edit existing book
router.route('/:id/edit')
  // Possibly add a middleware check here:
  .all((req, res, next) => {
    if (!req.session.user) {
      return res.status(401).render('error', { message: 'Please log in first' });
    }
    next();
  })
  .get(bookController.editBook)
  .post(bookController.editBook);


// Delete existing book
router.post('/:id/delete', bookController.deleteBook);

module.exports = router;

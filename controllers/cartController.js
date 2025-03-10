// controllers/cartController.js

const bookModel = require('../models/bookModel');

exports.viewCart = (req, res) => {
  const cart = req.session.cart || [];
  res.render('cart/index', { cart });
};

exports.addToCart = (req, res) => {
  // 1) Must be logged in
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const { bookId } = req.body;
  const book = bookModel.getBookById(bookId);
  if (!book) {
    return res.status(404).render('error', { message: 'Book not found' });
  }

  // 2) Can't buy your own book
  if (book.ownerId === req.session.user.id) {
    return res.status(403).render('error', { message: 'Cannot buy your own book.' });
  }

  // 3) Otherwise, add to cart
  if (!req.session.cart) {
    req.session.cart = [];
  }
  req.session.cart.push(book);

  return res.redirect('/cart');
};

exports.removeFromCart = (req, res) => {
  const { bookId } = req.body;
  if (!req.session.cart) {
    req.session.cart = [];
  }
  req.session.cart = req.session.cart.filter(b => b.id !== bookId);
  res.redirect('/cart');
};

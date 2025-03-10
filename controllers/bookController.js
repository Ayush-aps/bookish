// controllers/bookController.js

const bookModel = require('../models/bookModel');
const userModel = require('../models/userModel');

exports.listBooks = (req, res) => {
  let books = bookModel.getAllBooks();
  const { search, genre, minPrice, maxPrice } = req.query;

  // Optional search/filter logic
  if (search) {
    const s = search.toLowerCase();
    books = books.filter(b =>
      b.title.toLowerCase().includes(s) ||
      b.author.toLowerCase().includes(s)
    );
  }
  if (genre && genre !== 'All') {
    books = books.filter(b => b.genre.toLowerCase() === genre.toLowerCase());
  }
  if (!isNaN(parseFloat(minPrice))) {
    books = books.filter(b => b.price >= parseFloat(minPrice));
  }
  if (!isNaN(parseFloat(maxPrice))) {
    books = books.filter(b => b.price <= parseFloat(maxPrice));
  }

  return res.render('books/list', { books });
};

exports.getBookDetail = (req, res) => {
  const { id } = req.params;
  const book = bookModel.getBookById(id);
  if (!book) {
    return res.status(404).render('error', { message: 'Book not found' });
  }
  res.render('books/detail', { book });
};

// Add a new book (approvedSeller or admin)
exports.addBook = (req, res) => {
  if (req.method === 'GET') {
    return res.render('books/add', { book: null, editMode: false });
  }

  // POST - create
  const { title, author, genre, price, image } = req.body;
  const ownerId = req.session.user.id;

  // Must be "approvedSeller" or "admin"
  if (!['approvedSeller', 'admin'].includes(req.session.user.role)) {
    return res.status(403).render('error', { message: 'Access denied. Must be approved seller or admin.' });
  }

  bookModel.createBook({ title, author, genre, price, image, ownerId });

  // Redirect to the appropriate dashboard
  if (req.session.user.role === 'admin') {
    return res.redirect('/dashboard/admin');
  } else if (req.session.user.role === 'approvedSeller') {
    return res.redirect('/dashboard/approvedseller');
  } else {
    // If they're somehow still "seller"
    return res.redirect('/dashboard/seller');
  }
};

// Edit existing book
exports.editBook = (req, res) => {
  // 1) Check if logged in
  if (!req.session.user) {
    return res.status(401).render('error', { message: 'Please log in first' });
  }

  const { id } = req.params;
  const book = bookModel.getBookById(id);
  if (!book) {
    return res.status(404).render('error', { message: 'Book not found' });
  }

  // 2) Must be "approvedSeller" or "admin"
  if (!['approvedSeller', 'admin'].includes(req.session.user.role)) {
    return res.status(403).render('error', { message: 'Access denied. Must be approved seller or admin.' });
  }

  // 3) If not admin, must own the book
  if (req.session.user.role !== 'admin' && book.ownerId !== req.session.user.id) {
    return res.status(403).render('error', { message: 'Access denied. Not your book.' });
  }

  if (req.method === 'GET') {
    // Show the edit form
    return res.render('books/add', { book, editMode: true });
  }

  // POST - update
  const { title, author, genre, price, image } = req.body;
  bookModel.updateBook(id, { title, author, genre, price, image });

  // Redirect to dashboard or book detail
  if (req.session.user.role === 'admin') {
    return res.redirect('/dashboard/admin');
  } else if (req.session.user.role === 'approvedSeller') {
    return res.redirect('/dashboard/approvedseller');
  } else {
    return res.redirect('/dashboard/seller');
  }
};

exports.deleteBook = (req, res) => {
  // 1) Check if logged in
  if (!req.session.user) {
    return res.status(401).render('error', { message: 'Please log in first' });
  }

  const { id } = req.params;
  const book = bookModel.getBookById(id);
  if (!book) {
    return res.status(404).render('error', { message: 'Book not found' });
  }

  // 2) Must be "approvedSeller" or "admin"
  if (!['approvedSeller', 'admin'].includes(req.session.user.role)) {
    return res.status(403).render('error', { message: 'Access denied. Must be approved seller or admin.' });
  }

  // 3) If not admin, must own the book
  if (req.session.user.role !== 'admin' && book.ownerId !== req.session.user.id) {
    return res.status(403).render('error', { message: 'Access denied. Not your book.' });
  }

  bookModel.deleteBook(id);

  // Redirect to dashboard
  if (req.session.user.role === 'admin') {
    return res.redirect('/dashboard/admin');
  } else if (req.session.user.role === 'approvedSeller') {
    return res.redirect('/dashboard/approvedseller');
  } else {
    return res.redirect('/dashboard/seller');
  }
};

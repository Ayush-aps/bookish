// controllers/dashboardController.js

const userModel = require('../models/userModel');
const bookModel = require('../models/bookModel');

exports.userDashboard = (req, res) => {
  const user = userModel.getUserById(req.session.user.id);
  res.render('dashboard/userDashboard', { user });
};

exports.sellerDashboard = (req, res) => {
  // This works for both "seller" and "approvedSeller" if you set the route guard
  const seller = userModel.getUserById(req.session.user.id);
  const allBooks = bookModel.getAllBooks();
  const sellerBooks = allBooks.filter(b => b.ownerId === seller.id);
  res.render('dashboard/sellerDashboard', { seller, sellerBooks });
};

// For "approvedSeller" route if you want a separate page:
exports.approvedSellerDashboard = (req, res) => {
  const seller = userModel.getUserById(req.session.user.id);
  const allBooks = bookModel.getAllBooks();
  const sellerBooks = allBooks.filter(b => b.ownerId === seller.id);
  res.render('dashboard/approvedSellerDashboard', { seller, sellerBooks });
};

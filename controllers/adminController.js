const userModel = require('../models/userModel');
const bookModel = require('../models/bookModel');
const { readDB, writeDB } = require('../models/db');

// Helper to calculate monthly sales
function getMonthlySales() {
  const db = readDB();
  const orders = db.orders;

  // Create a map for month-year -> total
  const monthlyMap = {};

  orders.forEach(order => {
    const date = new Date(order.createdAt);
    const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`; // e.g. "2025-3"
    if (!monthlyMap[monthYear]) {
      monthlyMap[monthYear] = 0;
    }
    monthlyMap[monthYear] += order.totalPrice;
  });

  // Sort keys (month-year) and transform into arrays
  const labels = Object.keys(monthlyMap).sort();
  const data = labels.map(label => monthlyMap[label]);

  return { labels, data };
}

exports.adminDashboard = (req, res) => {
  const users = userModel.getAllUsers();
  const books = bookModel.getAllBooks();
  const { labels, data } = getMonthlySales();

  res.render('dashboard/adminDashboard', { users, books, labels, data });
};

// Approve an existing "seller" -> "approvedSeller"
exports.approveSeller = (req, res) => {
    const { userId } = req.body;
    const db = readDB();
  
    const user = db.users.find(u => u.id === userId);
  
    // Only if user is found AND role === 'seller'
    if (user && user.role === 'seller') {
      // Now we mark them as fully approved
      user.role = 'approvedSeller';
      writeDB(db);
    }
  
    return res.redirect('/dashboard/admin');
  };
  
  // Remove user (except admin)
  exports.removeUser = (req, res) => {
    const { userId } = req.body;
    const db = readDB();
  
    db.users = db.users.filter(u => {
      // Do NOT remove if they're admin
      if (u.id === userId && u.role !== 'admin') {
        return false; // remove them
      }
      return true;
    });
  
    writeDB(db);
    return res.redirect('/dashboard/admin');
  };
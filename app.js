// app.js

const express = require('express');
const path = require('path');
const session = require('express-session');

// Import userModel so we can sync session roles
const userModel = require('./models/userModel');

// Import your route files
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const cartRoutes = require('./routes/cartRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'YourSecretKeyHere',
  resave: false,
  saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/**
 * 1) Sync user’s role in session with DB on every request.
 *    (So if admin changes them from "seller" to "approvedSeller",
 *     the session updates immediately.)
 */
app.use((req, res, next) => {
  if (req.session.user) {
    const dbUser = userModel.getUserById(req.session.user.id);
    if (dbUser && dbUser.role !== req.session.user.role) {
      req.session.user.role = dbUser.role;
    }
  }
  next();
});

/**
 * 2) Make currentUser available in all templates
 */
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

// HOME → redirect to /books
app.get('/', (req, res) => {
  return res.redirect('/books');
});

// Attach your routes
app.use('/', authRoutes);
app.use('/books', bookRoutes);
app.use('/cart', cartRoutes);

// Must be logged in to access /dashboard
app.use('/dashboard', (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).render('error', { message: 'Please log in first' });
  }
  next();
}, dashboardRoutes);

// Protect /dashboard/admin (must be admin)
app.use('/dashboard/admin', (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).render('error', { message: 'Access denied' });
  }
  next();
}, adminRoutes);

// Reviews
app.use('/reviews', reviewRoutes);

// 404
app.use((req, res) => {
  res.status(404).render('error', { message: 'Page not found' });
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});

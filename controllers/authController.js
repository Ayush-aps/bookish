const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.getLogin = (req, res) => {
  res.render('auth/login', { error: null });
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;
  const user = userModel.findUserByEmail(email);

  if (!user) {
    return res.render('auth/login', { error: 'User not found' });
  }

  const match = bcrypt.compareSync(password, user.password);
  if (!match) {
    return res.render('auth/login', { error: 'Invalid password' });
  }

  req.session.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  if (user.role === 'admin') {
    return res.redirect('/dashboard/admin');
  } 
   else {
    return res.redirect('/books');
  }
};

exports.getRegister = (req, res) => {
  res.render('auth/register', { error: null });
};

exports.postRegister = (req, res) => {
  const { name, email, password, role } = req.body;
  const existingUser = userModel.findUserByEmail(email);

  if (existingUser) {
    return res.render('auth/register', { error: 'Email already exists' });
  }

  userModel.createUser({ name, email, password, role });
  res.redirect('/login');
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

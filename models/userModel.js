const { readDB, writeDB } = require('./db');
const bcrypt = require('bcrypt');

function getAllUsers() {
  const db = readDB();
  return db.users;
}

function createUser(userData) {
  const db = readDB();
  const hashedPassword = bcrypt.hashSync(userData.password, 10);

  const newUser = {
    id: Date.now().toString(),
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    role: userData.role || 'user'
  };
  db.users.push(newUser);
  writeDB(db);
  return newUser;
}

function findUserByEmail(email) {
  const db = readDB();
  return db.users.find(u => u.email === email);
}

function getUserById(userId) {
  const db = readDB();
  return db.users.find(u => u.id === userId);
}

module.exports = {
  getAllUsers,
  createUser,
  findUserByEmail,
  getUserById
};

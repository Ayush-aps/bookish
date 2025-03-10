const { readDB, writeDB } = require('./db');

function getAllBooks() {
  const db = readDB();
  return db.books;
}

function getBookById(bookId) {
  const db = readDB();
  return db.books.find(b => b.id === bookId);
}

function createBook(bookData) {
  const db = readDB();
  const newBook = {
    id: Date.now().toString(),
    title: bookData.title,
    author: bookData.author,
    genre: bookData.genre,
    price: parseFloat(bookData.price) || 0,
    image: bookData.image,
    ownerId: bookData.ownerId
  };
  db.books.push(newBook);
  writeDB(db);
  return newBook;
}

function updateBook(bookId, updates) {
  const db = readDB();
  const index = db.books.findIndex(b => b.id === bookId);
  if (index !== -1) {
    db.books[index] = { ...db.books[index], ...updates };
    writeDB(db);
    return db.books[index];
  }
  return null;
}

function deleteBook(bookId) {
  const db = readDB();
  db.books = db.books.filter(b => b.id !== bookId);
  writeDB(db);
}

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};

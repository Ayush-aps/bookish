const { readDB, writeDB } = require('./db');

function getAllReviews() {
  const db = readDB();
  return db.reviews;
}

function getReviewsByPage(page = 1, limit = 5) {
  const db = readDB();
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return db.reviews.slice(startIndex, endIndex);
}

function createReview(reviewData) {
  const db = readDB();
  const newReview = {
    id: Date.now().toString(),
    bookId: reviewData.bookId,
    userId: reviewData.userId,
    text: reviewData.text,
    createdAt: new Date()
  };
  db.reviews.push(newReview);
  writeDB(db);
  return newReview;
}

module.exports = {
  getAllReviews,
  getReviewsByPage,
  createReview
};

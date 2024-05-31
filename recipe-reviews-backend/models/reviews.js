const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  recipeId: {
    type: String,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

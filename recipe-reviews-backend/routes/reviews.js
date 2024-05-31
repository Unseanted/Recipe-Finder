const express = require('express');
const router = express.Router();
const Review = require('../models/review');

// Get reviews for a recipe
router.get('/:recipeId', async (req, res) => {
  try {
    const reviews = await Review.find({ recipeId: req.params.recipeId });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new review
router.post('/', async (req, res) => {
  const review = new Review({
    recipeId: req.body.recipeId,
    review: req.body.review,
  });

  try {
    const newReview = await review.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

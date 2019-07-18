const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  review: {
    type: String,
    max: 140,
    required: true
  },
  film: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

const { Router } = require('express');
const Review = require('../models/Review');

module.exports = Router()
  .post('/', (req, res, next) => {
    const {
      rating,
      reviewer,
      review,
      film
    } = req.body;

    Review
      .create({
        rating,
        reviewer,
        review,
        film
      })
      .then(review => res.send(review))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Review
      .find()
      .sort({ 'date': -1 })
      .limit(100)
      .select({ rating: true, review: true, film: true })
      .then(reviews => res.send(reviews))
      .catch(next);
  });

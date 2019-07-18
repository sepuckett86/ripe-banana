const { Router } = require('express');
const Film = require('../models/Film');
const Review = require('../models/Review');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { 
      title,
      studio,
      released,
      cast
    } = req.body;

    Film
      .create({
        title,
        studio,
        released,
        cast
      })
      .then(film => res.send(film))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Film
      .find()
      .populate('studio', { name: true })
      .select({ 'title': true, 'released': true, 'studio': true })
      .then(films => res.send(films))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    /*
    {
      title, released,
      studio: { _id, name },
      cast: [{
          _id, role,
          actor: { _id, name }
      }],
      reviews: [{
          id, rating, review,
          reviewer: { _id, name }
      }]
    }
    */ 
    Promise.all([
      Film
        .findById(req.params.id)
        .populate('studio', { __v: false, address: false })
        .populate('cast.actor', { _id: true, name: true })
        .select({ __v: false }),
      Review
        .find({ film: req.params.id })
        .populate('reviewer', { _id: true, name: true })
        .select({ _id: true, rating: true, review: true, reviewer: true })
    ])
      .then(([film, reviews]) => res.send({ ...film.toJSON(), reviews }))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    Film
      .findByIdAndDelete(req.params.id)
      .then(film => res.send(film))
      .catch(next);
  });


const { Router } = require('express');
const Studio = require('../models/Studio');
const Film = require('../models/Film');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { name, address } = req.body;
    Studio
      .create({
        name,
        address
      })
      .then(studio => res.send(studio))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    // [{ _id, name }]
    Studio
      .find()
      .select({ 'name': true })
      .then(studios => res.send(studios))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    // { _id, name, address, films: [{ _id, title }] }
    Studio
      .findByIdWithFilms(req.params.id)
      .then((studio) => {
        res.send(studio);
      })
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    Film
      .find({ studio: req.params.id })
      .then(films => {
        if(films.length === 0) {
          Studio
            .findByIdAndDelete(req.params.id)
            .then(studio => res.send(studio))
            .catch(next);
        } else {
          res.send({
            message: 'Could not delete studio because there is a film with this studio'
          });
        }
      })
      .catch(next);
  });


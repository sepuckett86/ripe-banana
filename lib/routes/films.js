const { Router } = require('express');
const Film = require('../models/Film');

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
      .then(films => res.send(films))
      .catch(next);
  });
// .get('/:id', (req, res, next) => {
//   Film
//     .findById(req.params.id)
//     .then(studio => res.send(studio))
//     .catch(next);
// })
// .delete('/:id', (req, res, next) => {
//   Film
//     .findByIdAndDelete(req.params.id)
//     .then(studio => res.send(studio))
//     .catch(next);
// });


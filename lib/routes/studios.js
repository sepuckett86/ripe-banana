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
    Promise.all([
      Studio
        .findById(req.params.id)
        .select({ __v: false }),
      Film
        .find({ studio: req.params.id })
        .select({ title: true })
    ])
      .then(([studio, films]) => {
        res.send({ ...studio.toJSON(), films });
      })
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    Studio
      .findByIdAndDelete(req.params.id)
      .then(studio => res.send(studio))
      .catch(next);
  });


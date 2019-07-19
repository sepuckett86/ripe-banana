const { Router } = require('express');
const Actor = require('../models/Actor');
const Film = require('../models/Film');

module.exports = Router()
  .post('/', (req, res, next) => {
    const {
      name,
      dob,
      pob
    } = req.body;

    Actor
      .create({ name, dob, pob })
      .then(actor => res.send(actor))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    // [{ _id, name }]
    Actor
      .find()
      .select({ 'name' : true })
      .then(actors => res.send(actors))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    // {
    //  name, dob, pob,
    //  films: [{ id, title, released }]
    // }
    Promise.all([
      Actor
        .findById(req.params.id)
        .select({ '__v': false }),
      Film
        .find({ 'cast.actor': req.params.id })
        .select({ title: true, released: true })
    ])
      .then(([actor, films]) => {
        res.send({ ...actor.toJSON(), films });
      })
      .catch(next);
  })
  .put('/:id', (req, res, next) => {
    const {
      name,
      dob,
      pob
    } = req.body;
    Actor
      .findByIdAndUpdate(req.params.id, { name, dob, pob }, { new: true })
      .then(updatedActor => res.send(updatedActor))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    Film
      .find({ 'cast.actor': req.params.id })
      .then(films => {
        if(films.length === 0) {
          Actor
            .findByIdAndDelete(req.params.id)
            .then(actor => res.send(actor))
            .catch(next);
        } else {
          res.send({
            message: 'Could not delete actor because in a film'
          });
        }
      })
      .catch(next);
  });

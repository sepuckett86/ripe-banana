const mongoose = require('mongoose');

const studioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    city: String,
    state: String,
    country: String
  }
});

studioSchema.statics.findByIdWithFilms = function(id) {
  return Promise.all([
    this
      .findById(id)
      .select({ __v: false }),
    this.model('Film')
      .find({ studio: id })
      .select({ title: true })
  ])
    .then(([studio, films]) => {
      return { ...studio.toJSON(), films };
    });
};

const Studio = mongoose.model('Studio', studioSchema);

module.exports = Studio;

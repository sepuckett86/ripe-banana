require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');
const Review = require('../lib/models/Review');
const Reviewer = require('../lib/models/Reviewer');

describe('studio routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });
  
  let actor = null;
  let studio = null;
  beforeEach(async() => {
    actor = JSON.parse(JSON.stringify(await Actor.create({
      name: 'Leonardo DiCaprio',
      dob: new Date('November 11, 1974'),
      pob: 'Hollywood, California'
    })));
    studio = JSON.parse(JSON.stringify(await Studio.create({
      name: 'Firefly Studio',
      address: {
        city: 'Los Angeles',
        state: 'California',
        country: 'United States'
      }
    })));
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('posts a film', () => {
    return request(app)
      .post('/api/v1/films')
      .send({ 
        title: 'Awesome Sauce',
        studio: studio._id,
        released: 1990,
        cast: [{
          role: 'Derrick Strong',
          actor: actor._id
        }]
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          title: 'Awesome Sauce',
          studio: studio._id.toString(),
          released: 1990,
          cast: [{
            _id: expect.any(String),
            role: 'Derrick Strong',
            actor: actor._id.toString()
          }],
          __v: 0
        });
      });
  });

  it('gets films', async() => {
    // [{
    //  _id, title, released,
    //  studio: { _id, name }
    // }]
    await Film.create({
      title: 'Awesome Sauce',
      studio: studio._id,
      released: 1990,
      cast: [{
        role: 'Derrick Strong',
        actor: actor._id
      }]
    });

    return request(app)
      .get('/api/v1/films')
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.any(String),
          title: 'Awesome Sauce',
          studio: {
            _id: expect.any(String),
            name: 'Firefly Studio'
          },
          released: 1990
        }]);
      });
  });

  it('gets film by id', async() => {
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
    const reviewer = JSON.parse(JSON.stringify(await Reviewer.create({
      name: 'Andy Sandy',
      company: 'Rotten Tomatoes'
    })));
    const film = JSON.parse(JSON.stringify(await Film.create({
      title: 'Awesome Sauce',
      studio: studio._id,
      released: 1990,
      cast: [{
        role: 'Derrick Strong',
        actor: actor._id
      }]
    })));
    const review = JSON.parse(JSON.stringify(await Review.create({
      rating: 5,
      reviewer: reviewer._id,
      review: 'This movie is AWESOME',
      film: film._id,
    })));

    return request(app)
      .get(`/api/v1/films/${film._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: film._id,
          title: 'Awesome Sauce',
          studio: {
            _id: studio._id,
            name: studio.name
          },
          released: 1990,
          cast: [{
            _id: film.cast._id,
            role: 'Derrick Strong',
            actor: {
              _id: actor._id,
              name: actor.name
            }
          }],
          reviews: [{
            id: review._id, 
            rating: review.rating, 
            review: review.review,
            reviewer: {
              _id: reviewer._id,
              name: reviewer.name
            }
          }]
        });
      });
  });

  it('deletes film', async() => {
    const film = await Film.create({
      title: 'Awesome Sauce',
      studio: studio._id,
      released: 1990,
      cast: [{
        role: 'Derrick Strong',
        actor: actor._id
      }]
    });
    return request(app)
      .delete(`/api/v1/films/${film._id}`)
      .then(res => {
        const filmCleaned = JSON.parse(JSON.stringify(film));
        expect(res.body).toEqual(filmCleaned);
      });
  });
});

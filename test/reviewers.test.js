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

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('posts a reviewer', () => {
    return request(app)
      .post('/api/v1/reviewers')
      .send({ 
        name: 'Andy Sandy',
        company: 'Rotten Tomatoes'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Andy Sandy',
          company: 'Rotten Tomatoes',
          __v: 0
        });
      });
  });

  it('gets reviewers', async() => {
    const reviewer = await Reviewer.create({
      name: 'Andy Sandy',
      company: 'Rotten Tomatoes'
    });

    return request(app)
      .get('/api/v1/reviewers')
      .then(res => {
        const reviewerCleaned = JSON.parse(JSON.stringify(reviewer));
        expect(res.body).toEqual([reviewerCleaned]);
      });
  });

  it('gets reviewer by id', async() => {
    const reviewer = JSON.parse(JSON.stringify(await Reviewer.create({
      name: 'Andy Sandy',
      company: 'Rotten Tomatoes'
    })));

    const studio = JSON.parse(JSON.stringify(await Studio.create({
      name: 'Firefly Studio',
      address: {
        city: 'Los Angeles',
        state: 'California',
        country: 'United States'
      }
    })));

    const actor = JSON.parse(JSON.stringify(await Actor.create({
      name: 'Leonardo DiCaprio',
      dob: new Date('November 11, 1974'),
      pob: 'Hollywood, California'
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
      .get(`/api/v1/reviewers/${reviewer._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: reviewer._id,
          name: 'Andy Sandy',
          company: 'Rotten Tomatoes',
          reviews: [{
            _id: review._id, 
            rating: review.rating, 
            review: review.review,
            film: { 
              _id: film._id,
              title: film.title 
            }
          }]
        });
      });
  });

  it('updates reviewer', async() => {
    const reviewer = await Reviewer.create({
      name: 'Andy Sandy',
      company: 'Rotten Tomatoes'
    });
    return request(app)
      .put(`/api/v1/reviewers/${reviewer._id}`)
      .send({
        name: 'Melon Smith',
        company: 'IMDB'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Melon Smith',
          company: 'IMDB',
          __v: 0
        });
      });
  });

  it('deletes reviewer', async() => {
    const reviewer = await Reviewer.create({
      name: 'Andy Sandy',
      company: 'Rotten Tomatoes'
    });
    return request(app)
      .delete(`/api/v1/reviewers/${reviewer._id}`)
      .then(res => {
        const reviewerCleaned = JSON.parse(JSON.stringify(reviewer));
        expect(res.body).toEqual(reviewerCleaned);
      });
  });
});

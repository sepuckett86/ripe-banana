require('dotenv').config();

const request = require('supertest');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const app = require('../lib/app');
const Review = require('../lib/models/Review');
const Reviewer = require('../lib/models/Reviewer');
const Film = require('../lib/models/Film');
const Actor = require('../lib/models/Actor');
const Studio = require('../lib/models/Studio');

describe('reviews routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let reviewer = null;
  let studio = null;
  let actor = null;
  let film = null;
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
    film = JSON.parse(JSON.stringify(await Film.create({
      title: 'Awesome Sauce',
      studio: studio._id,
      released: 1990,
      cast: [{
        role: 'Derrick Strong',
        actor: actor._id
      }]
    })));
    reviewer = JSON.parse(JSON.stringify(await Reviewer.create({
      name: 'Andy Sandy',
      company: 'Rotten Tomatoes'
    })));
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('posts a review', () => {
    const review = {
      rating: 5,
      reviewer: reviewer._id,
      review: 'This movie is AWESOME',
      film: film._id,
    };

    return request(app)
      .post('/api/v1/reviews')
      .send(review)
      .then(res => {
        const filmCleaned = JSON.parse(JSON.stringify(film));
        const reviewerCleaned = JSON.parse(JSON.stringify(reviewer));
        expect(res.body).toEqual({
          _id: expect.any(String),
          rating: 5,
          reviewer: reviewerCleaned._id,
          review: 'This movie is AWESOME',
          film: filmCleaned._id,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          __v: 0
        });
      });
  });

  it('gets all reviews, limited to 100 most recent', async() => {
    // [{
    //  _id, rating, review,
    //  film: { _id, title }
    // }]
    await Promise.all([...Array(101)].map((review, i) => {
      return Review.create({
        rating: 5,
        reviewer: reviewer._id,
        review: `This movie is AWESOME ${i}`,
        film: film._id,
      });
    }));

    return request(app)
      .get('/api/v1/reviews')
      .then(res => {
        expect(res.body).toHaveLength(100);
      });
  });

  it('gets all reviews, with correct review content', async() => {
    // [{
    //  _id, rating, review,
    //  film: { _id, title }
    // }]

    await Promise.all([...Array(101)].map((review, i) => {
      return Review.create({
        rating: 5,
        reviewer: reviewer._id,
        review: `This movie is AWESOME ${i}`,
        film: film._id,
      });
    }));

    return request(app)
      .get('/api/v1/reviews')
      .then(res => {
        expect(res.body[0]).toEqual({
          _id: expect.any(String),
          rating: 5,
          review: expect.any(String),
          film: {
            _id: film._id,
            title: film.title
          },
        });
      });
  });
});

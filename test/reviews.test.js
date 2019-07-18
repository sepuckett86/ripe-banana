require('dotenv').config();

const request = require('supertest');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const app = require('../lib/app');
// const Review = require('../lib/models/Review');
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
      .post('/')
      .send({})
      .then(res => {
        const reviewCleaned = JSON.parse(JSON.stringify(review));
        const filmCleaned = JSON.parse(JSON.stringify(film));
        const reviewerCleaned = JSON.parse(JSON.stringify(reviewer));
        expect(res.body).toEqual({
          _id: reviewCleaned._id,
          rating: 5,
          reviewer: reviewerCleaned._id,
          review: 'This movie is AWESOME',
          film: filmCleaned._id,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          __v: 0
        });
      });
  });
});

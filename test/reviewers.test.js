require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
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
    const reviewer = await Reviewer.create({
      name: 'Andy Sandy',
      company: 'Rotten Tomatoes'
    });
    return request(app)
      .get(`/api/v1/reviewers/${reviewer._id}`)
      .then(res => {
        const reviewerCleaned = JSON.parse(JSON.stringify(reviewer));
        expect(res.body).toEqual(reviewerCleaned);
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

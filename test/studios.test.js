require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');

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

  it('posts a studio', () => {
    return request(app)
      .post('/api/v1/studios')
      .send({ 
        name: 'Firefly Studio',
        address: {
          city: 'Los Angeles',
          state: 'California',
          country: 'United States'
        }
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Firefly Studio',
          address: {
            city: 'Los Angeles',
            state: 'California',
            country: 'United States'
          },
          __v: 0
        });
      });
  });

  it('gets studios', async() => {
    const studio = await Studio.create({
      name: 'Firefly Studio',
      address: {
        city: 'Los Angeles',
        state: 'California',
        country: 'United States'
      }
    });

    return request(app)
      .get('/api/v1/studios')
      .then(res => {
        const studioCleaned = JSON.parse(JSON.stringify(studio));
        expect(res.body).toEqual([studioCleaned]);
      });
  });
});

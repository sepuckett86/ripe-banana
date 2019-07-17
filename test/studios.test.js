require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');

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
          __v: expect.any(String)
        });
      });
  });
});

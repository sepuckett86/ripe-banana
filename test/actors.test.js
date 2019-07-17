require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../lib/models/Actor');

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

  it('posts an actor', () => {
    return request(app)
      .post('/api/v1/actors')
      .send({ 
        name: 'Leonardo DiCaprio',
        dob: new Date('November 11, 1974'),
        pob: 'Hollywood, California'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Leonardo DiCaprio',
          dob: new Date('November 11, 1974').toISOString(),
          pob: 'Hollywood, California',
          __v: 0
        });
      });
  });

  // it('gets studios', async() => {
  //   const studio = await Studio.create({
  //     name: 'Firefly Studio',
  //     address: {
  //       city: 'Los Angeles',
  //       state: 'California',
  //       country: 'United States'
  //     }
  //   });

  //   return request(app)
  //     .get('/api/v1/studios')
  //     .then(res => {
  //       const studioCleaned = JSON.parse(JSON.stringify(studio));
  //       expect(res.body).toEqual([studioCleaned]);
  //     });
  // });
  // it('gets studio by id', async() => {
  //   const studio = await Studio.create({
  //     name: 'Firefly Studio',
  //     address: {
  //       city: 'Los Angeles',
  //       state: 'California',
  //       country: 'United States'
  //     }
  //   });
  //   return request(app)
  //     .get(`/api/v1/studios/${studio._id}`)
  //     .then(res => {
  //       const studioCleaned = JSON.parse(JSON.stringify(studio));
  //       expect(res.body).toEqual(studioCleaned);
  //     });
  // });
  // it('deletes studio', async() => {
  //   const studio = await Studio.create({
  //     name: 'Firefly Studio',
  //     address: {
  //       city: 'Los Angeles',
  //       state: 'California',
  //       country: 'United States'
  //     }
  //   });
  //   return request(app)
  //     .delete(`/api/v1/studios/${studio._id}`)
  //     .then(res => {
  //       const studioCleaned = JSON.parse(JSON.stringify(studio));
  //       expect(res.body).toEqual(studioCleaned);
  //     });
  // });
});

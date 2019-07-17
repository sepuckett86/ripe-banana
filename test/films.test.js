require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');
// const Film = require('../lib/models/Film');

describe('studio routes', () => {
  beforeAll(() => {
    connect();
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
    return mongoose.connection.dropDatabase();
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
        console.log(res.body);
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

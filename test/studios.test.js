require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');

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
        expect(res.body).toEqual([{
          _id: studioCleaned._id,
          name: 'Firefly Studio',
        }]);
      });
  });

  it('gets studio by id', async() => {
    // { _id, name, address, films: [{ _id, title }] }
    const studio = await Studio.create({
      name: 'Firefly Studio',
      address: {
        city: 'Los Angeles',
        state: 'California',
        country: 'United States'
      }
    });

    const actor = await Actor.create({
      name: 'Leonardo DiCaprio',
      dob: new Date('November 11, 1974'),
      pob: 'Hollywood, California'
    });

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
      .get(`/api/v1/studios/${studio._id}`)
      .then(res => {
        const studioCleaned = JSON.parse(JSON.stringify(studio));
        const filmCleaned = JSON.parse(JSON.stringify(film));
        expect(res.body).toEqual({
          _id: studioCleaned._id,
          name: studioCleaned.name,
          address: studioCleaned.address,
          films: [{
            _id: filmCleaned._id,
            title: filmCleaned.title
          }]
        });
      });
  });
  
  it('deletes studio', async() => {
    const studio = await Studio.create({
      name: 'Firefly Studio',
      address: {
        city: 'Los Angeles',
        state: 'California',
        country: 'United States'
      }
    });
    return request(app)
      .delete(`/api/v1/studios/${studio._id}`)
      .then(res => {
        const studioCleaned = JSON.parse(JSON.stringify(studio));
        expect(res.body).toEqual(studioCleaned);
      });
  });
});

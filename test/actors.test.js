require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');
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

  it('gets actors', async() => {
    // [{ _id, name }]
    const actor = await Actor.create({
      name: 'Leonardo DiCaprio',
      dob: new Date('November 11, 1974'),
      pob: 'Hollywood, California'
    });

    return request(app)
      .get('/api/v1/actors')
      .then(res => {
        const actorCleaned = JSON.parse(JSON.stringify(actor));
        expect(res.body).toEqual([{
          _id: actorCleaned._id,
          name: actorCleaned.name
        }]);
      });
  });

  it('gets actor by id', async() => {
    // {
    //  name, dob, pob,
    //  films: [{ id, title, released }]
    // }
    const actor = await Actor.create({
      name: 'Leonardo DiCaprio',
      dob: new Date('November 11, 1974'),
      pob: 'Hollywood, California'
    });

    const studio = await Studio.create({
      name: 'Firefly Studio',
      address: {
        city: 'Los Angeles',
        state: 'California',
        country: 'United States'
      }
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
      .get(`/api/v1/actors/${actor._id}`)
      .then(res => {
        const actorCleaned = JSON.parse(JSON.stringify(actor));
        const filmCleaned = JSON.parse(JSON.stringify(film));
        expect(res.body).toEqual({
          _id: actorCleaned._id,
          name: actorCleaned.name,
          dob: actorCleaned.dob,
          pob: actorCleaned.pob,
          films: [{
            _id: filmCleaned._id,
            title: filmCleaned.title,
            released: filmCleaned.released
          }]
        });
      });
  });

  it('updates actor', async() => {
    const actor = await Actor.create({
      name: 'Leonardo DiCaprio',
      dob: new Date('November 11, 1974'),
      pob: 'Hollywood, California'
    });
    return request(app)
      .put(`/api/v1/actors/${actor._id}`)
      .send({
        name: 'Ellen Page',
        dob: new Date('February 21, 1987'),
        pob: 'Halifax, Nova Scotia'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Ellen Page',
          dob: new Date('February 21, 1987').toISOString(),
          pob: 'Halifax, Nova Scotia',
          __v: 0
        });
      });
  });

  it('deletes actor', async() => {
    const actor = await Actor.create({
      name: 'Leonardo DiCaprio',
      dob: new Date('November 11, 1974'),
      pob: 'Hollywood, California'
    });
    return request(app)
      .delete(`/api/v1/actors/${actor._id}`)
      .then(res => {
        const actorCleaned = JSON.parse(JSON.stringify(actor));
        expect(res.body).toEqual(actorCleaned);
      });
  });

  it('does not delete actor if in film', async() => {
    const actor = await Actor.create({
      name: 'Leonardo DiCaprio',
      dob: new Date('November 11, 1974'),
      pob: 'Hollywood, California'
    });

    const studio = await Studio.create({
      name: 'Firefly Studio',
      address: {
        city: 'Los Angeles',
        state: 'California',
        country: 'United States'
      }
    });

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
      .delete(`/api/v1/actors/${actor._id}`)
      .then(res => {
        expect(res.body).toEqual({
          message: 'Could not delete actor because in a film'
        });
      });
  });
});

'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pg = require('pg');
const PORT = process.env.PORT || 3000;

const server = express();
server.use(cors());
const client = new pg.Client(process.env.DATABASE_URL);
client.connect()
  .then(() => {
    server.listen(PORT, () =>
      console.log(`listening on ${PORT}`)
    );
  })

// ---------------------------------------------------
const myLocation = require('./Location.js');
const myWeather = require('./Weather.js');
const myTrails = require('./Trails.js');
const myMovies = require('./Movies.js');
const myYelp = require('./Yelp.js');

// --------------------------------------------------


// ----------------------------------------------------
server.get('/location', myLocation);
server.get('/weather', myWeather);
server.get('/trails', myTrails);
server.get('/movie', myMovies);
server.get('/yelp', myYelp);


// ----------------------------------------------------

server.use('*', (req, res) => {
  res.status(500).send('Sorry, something went wrong');
})

server.use((error, req, res) => {
  res.status(500).send(error);
})

// server.listen(PORT, () =>
//   console.log(`listening on ${PORT}`)
// );



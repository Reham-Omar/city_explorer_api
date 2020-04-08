'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pg = require('pg');
const superagent = require('superagent');
const PORT = process.env.PORT || 3000;
const client = new pg.Client(process.env.DATABASE_URL);
const server = express();
server.use(cors());

server.get('/', (req, res) => {
  res.status(200).send('It works ');
})


server.get('/location', getlocation);

function getlocation(request, response) {
  const city = request.query.city;
  console.log(city);
  const dataBase = 'SELECT search_query FROM locations WHERE search_query = $1;'
  const safeV = [city];
  client.query(dataBase, safeV).then((result) => {
    if (result.rows.length !== 0) {
      const dataBaseData = 'SELECT search_query, formatted_query, latitude, longitude FROM locations WHERE search_query = $1';

      client.query(dataBaseData, safeV).then(result => {
        console.log('daaaaaaaaaaaaaaaaaaaataaaaaaaaaa');
        response.status(200).json(result.rows[0]);
      })

    }

    else {
      let key = process.env.GEOCODE_API_KEY;
      const url = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;

      superagent.get(url)
        .then(geoData => {
          const locationData = new Location(city, geoData.body);

          let SQL = 'INSERT INTO locations (search_query , formatted_query, latitude, longitude) VALUES ($1,$2,$3,$4) RETURNING *;';
          let safeValues = [locationData.search_query, locationData.formatted_query, locationData.latitude, locationData.longitude];

          client.query(SQL, safeValues)
            .then(results => {
              console.log('aaaaaaaaaaaaaaappppppppppiiiiiiiiii');
              response.status(200).json(locationData);
            });
        })
        .catch((err) => {
          errorHandler(err, request, response);
        });
    }

  })
}
function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}

// ---------------------------
// Weather
// --------------------------


server.get('/weather', (req, res) => {
  let arrayOfWeather = [];
  const weatherCity = req.query.city;
  let key = process.env.WEATHER_API_KEY;
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${weatherCity}&key=${key}`;

  superagent.get(url)
    .then(getData => {

      arrayOfWeather = getData.body.data.map((val) => {
        return new Weather(val);
      })
      res.status(200).json(arrayOfWeather);
    })
})

function Weather(getData) {
  this.description = getData.weather.description;
  this.time = getData.valid_date;
}

// ------------------------
// trial
// ------------------------

server.get('/trails', (req, res) => {

  let arrayOfTrial = [];
  let key = process.env.TRAIL_API_KEY;
  const lat = req.query.lat;
  const lon = req.query.lon;

  const url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=100&key=${key}`;

  superagent.get(url)
    .then(getData => {

      arrayOfTrial = getData.body.trails.map((val) => {
        return new Trails(val);

      })
      res.status(200).json(arrayOfTrial);
    })

})


function Trails(getData) {
  this.name = getData.name;
  this.location = getData.location;
  this.length = getData.length;
  this.stars = getData.stars;
  this.star_votes = getData.starVotes;
  this.summary = getData.summary;
  this.trail_url = getData.url;
  this.conditions = getData.conditionStatus;
  this.condition_date = getData.conditionDate.toString().slice(0, 11);
  this.condition_time = getData.conditionDate.toString().slice(11, 19);


}
// ----------------------------------
// movies
// ------------------------------------
server.get('/movie', (req, res) => {
  let arrayOfMovies = [];
  const moviesCity = req.query.query;
  let key=process.env.MOVIE_API_KEY;
  const url=`https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${moviesCity}`;

  superagent.get(url)
    .then(getData => {

      arrayOfMovies = getData.body.results.map((val) => {
        return new Movie(val);
      })
      res.status(200).json(arrayOfMovies);
    })
})
function Movie(getData) {
  this.title = getData.title;
  this.overview = getData.overview;
  this.average_votes=getData.vote_average;
  this.total_votes=getData.vote_count;
  this.image_url=getData.poster_path;
  this.popularity=getData.popularity;
  this.released_on=getData.release_date;
}
// -----------------------------------------
// yelp
// --------------------------------------------

server.get('/yelp', (req, res) => {
  let arrayOfResturant = [];
  const resCity = req.query.location;
  const url=`https://api.yelp.com/v3/businesses/search?location=${resCity}`;
  const key=process.env.YELP_API_KEY;
  superagent.get(url)
  .set('Authorization',`Bearer ${key}`)
    .then(getData => {
      arrayOfResturant = getData.body.businesses.map((val) => {
        return new Resturant(val);
      })
      res.status(200).json(arrayOfResturant);
    })
})
function Resturant(getData) {
  this.name = getData.name;
  this.image_url=getData.image_url;
  this.price=getData.price;
  this.rating=getData.rating;
  this.url = getData.url;
  }

// ---------------------------------------
// ---------------------------------------
server.use('*', (req, res) => {
  res.status(500).send('Sorry, something went wrong');
})

server.use((error, req, res) => {
  res.status(500).send(error);
})

client.connect()
  .then(() => {
    server.listen(PORT, () =>
      console.log(`listening on ${PORT}`)
    );
  })

  
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


// ----------------------------------
// LOCATION
// -----------------------------------
let locationArray = {};
server.get('/location', getlocation);

function getlocation(req, res) {
    const city = req.query.city;
    let key = process.env.GEOCODE_API_KEY;
    const url = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;

    if (locationArray[city]) {
        // console.log('daaaaaaaaaaaaaaaaaaaaaaatabaase');
        res.status(200).json(locationArray[city]);
    }
    else {
        // console.log('AAAAAAAAAAAAAAAAAPPPPPPPPPPPPIIIIIIIII');
        superagent.get(url)
            .then(geoData => {
                const locationData = new Location(city, geoData.body);
                
                res.status(200).json(locationData);
                console.log('yyyyyyyyyyyyyyyyyyyyyyyy',locationArray);
                // console.log('wwwwwwwwwwwwwwwwwwwww',locationData);
                 
                // let SQL = 'INSERT INTO locations (search_query , formatted_query, latitude, longitude) VALUES ($1,$2,$3,$4)';
                // let safeValues = [locationData.search_query, locationData.formatted_query, locationData.latitude, locationData.longitude];
                // console.log('qqqqqqqqqqqqqqqqqqqqqqqqq',safeValues);

                // client.query(SQL, safeValues)
                //     .then(results => {
                //         console.log('reeeeeeeeeeeehaaaaaaam',results);
                //         var newLocation = results.row[0];
                //         locationArray[city] = newLocation;
                //      console.log('yyyyyyyyyy',newLocation);
                //      console.log('vvvvvvvvvvvvvvvvvvvvvvvv',locationArray[city]);
                        
                //         res.status(200).json(newLocation);
                //     });
            })

    }

}

function Location(city, geoData) {
    this.search_query = city;
    this.formatted_query = geoData[0].display_name;
    this.latitude = geoData[0].lat;
    this.longitude = geoData[0].lon;
    // locationArray.push(this);
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

    const url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=10&key=${key}`;

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
// ------------------------------------
server.use('*', (req, res) => {
    res.status(500).send('Sorry, something went wrong');
})

server.use((error, req, res) => {
    res.status(500).send(error);
})

// function errorHandler(error, request, response) {
//     response.status(500).send(error);
// }
client.connect()
    .then(() => {
        server.listen(PORT, () =>
            console.log(`listening on ${PORT}`)
        );
    })

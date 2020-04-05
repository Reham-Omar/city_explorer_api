'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const server = express();
server.use(cors());

server.get('/', (req, res) => {
    res.status(200).send('It works ');
})
// ----------------------------------
// LOCATION
// -----------------------------------

server.get('/location', (req, res) => {
    const geoData = require('./data/geo.json');
    const city = req.query.city;
    const locationData = new Location(city, geoData);
    res.status(200).send(locationData);

})
function Location(city, geoData) {
    this.search_query = city;
    this.search_query = 'Amman',
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
    const getData = require('./data/weather.json');
    getData.data.forEach(() => {
        let theWeather = new Weather(getData);
        arrayOfWeather.push(theWeather);
        
    })
    res.status(200).send(arrayOfWeather);
    // console.log(arrayOfWeather);
})


function Weather(getData) {
    this.description = getData.data[0].weather.description;
    this.time = getData.data[0].valid_date;
}

// ------------------------
// --------------------------
server.use('*', (req, res) => {
    res.status(500).send('Sorry, something went wrong');
})
server.use((error, req, res) => {
    res.status(500).send(error);
})
server.listen(PORT, () => {
    console.log(`listening to port ${PORT}`);
})
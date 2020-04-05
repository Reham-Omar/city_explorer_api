'use strict';
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const server = express();
server.use(cors());
server.listen(PORT, () => {
    console.log(`listening to port ${PORT}`);
})

server.get('/', (req, res) => {
    res.status(200).send('It works ');
})
server.get('/location', (req, res) => {
    const geoData = require('./data/geo.json');
    const city = req.query.city;
    const locationData = new Location(city,geoData);
    res.send(locationData);

})
function Location (city,geoData) {
    this.search_query = city;
    this.formatted_query = geoData[0].display_name;
    this.latitude = geoData[0].lat;
    this.longitude = geoData[0].lon;
    
}

server.get('/weather', (req, res) => {
    const weatherData = require('./data/weather.json');
    const city = req.query.city;
    const dataOfWeather = new Weather(city,weatherData);
    res.send(dataOfWeather);

})
function Weather (city,weatherData) {
    this.search_query = city;
    this.description = weatherData.data[0].description;
    this.time = weatherData.data[0].datetime;
   
    
}

server.use('*', (req, res) => {
    res.status(404).send('Not Found ');
})
server.use((error, req, res) => {
    res.status(500).send(error);
})
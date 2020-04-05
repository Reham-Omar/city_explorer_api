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


server.use('*', (req, res) => {
    res.status(404).send('Not Found ');
})
server.use((error, req, res) => {
    res.status(500).send(error);
})
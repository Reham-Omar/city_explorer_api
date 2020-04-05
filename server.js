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

server.use('*', (req, res) => {
    res.status(404).send('Not Found ');
})
server.use((error, req, res) => {
    res.status(500).send(error);
})
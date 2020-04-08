// ---------------------------
// Weather
// --------------------------
const superagent = require('superagent');

function getweather(req, res) {
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
}


function Weather(getData) {
    this.description = getData.weather.description;
    this.time = getData.valid_date;
}
module.exports = getweather;  
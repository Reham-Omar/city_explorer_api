
// ------------------------
// trial
// ------------------------
const superagent = require('superagent');


function getTrails(req, res) {
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
}


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
module.exports = getTrails;
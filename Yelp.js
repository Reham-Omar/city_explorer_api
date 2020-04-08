// -----------------------------------------
// yelp
// --------------------------------------------
const superagent = require('superagent');

function getYelp(req, res) {
    let arrayOfResturant = [];
    const resCity = req.query.location;
    const url = `https://api.yelp.com/v3/businesses/search?location=${resCity}`;
    const key = process.env.YELP_API_KEY;
    superagent.get(url)
        .set('Authorization', `Bearer ${key}`)
        .then(getData => {
            arrayOfResturant = getData.body.businesses.map((val) => {
                return new Resturant(val);
            })
            res.status(200).json(arrayOfResturant);
        })
}

function Resturant(getData) {
    this.name = getData.name;
    this.image_url = getData.image_url;
    this.price = getData.price;
    this.rating = getData.rating;
    this.url = getData.url;
}
module.exports = getYelp;
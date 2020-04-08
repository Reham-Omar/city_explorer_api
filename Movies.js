// ----------------------------------
// movies
// ------------------------------------
const superagent = require('superagent');


function getMovies(req, res) {
    let arrayOfMovies = [];
    const moviesCity = req.query.query;
    let key = process.env.MOVIE_API_KEY;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${moviesCity}`;

    superagent.get(url)
        .then(getData => {

            arrayOfMovies = getData.body.results.map((val) => {
                return new Movie(val);
            })
            res.status(200).json(arrayOfMovies);
        })
}

function Movie(getData) {
    this.title = getData.title;
    this.overview = getData.overview;
    this.average_votes = getData.vote_average;
    this.total_votes = getData.vote_count;
    this.image_url = getData.poster_path;
    this.popularity = getData.popularity;
    this.released_on = getData.release_date;
}

module.exports = getMovies;
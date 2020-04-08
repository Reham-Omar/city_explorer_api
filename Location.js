
const superagent = require('superagent');

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

module.exports = getlocation;
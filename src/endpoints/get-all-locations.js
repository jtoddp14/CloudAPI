const MetaResponseMapper = require('../mappers/meta-response-mapper');

exports.handle = (request, response, connection, format) => {
    // open the connection:
    connection.connect();
    try {
        const sqlQuery = "SELECT * FROM `Locations`";
        const query = connection.query(sqlQuery, function (error, results, fields) {
            if (error) {
                console.error(error.toString());
                response.status(500).send({
                    success: false,
                    error: 'An error has occured while trying to fetch locations'
                }).end();
            } else {
                // closing the connection only inside the callback to prevent a race condition:
                connection.end();
                response.status(200).send({
                    success: true,
                    results
                }).end();
            }
        });
    } catch (e) {
        console.error(e.toString());
    }
};
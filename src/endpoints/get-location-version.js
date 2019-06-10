const mySqlConnection = require('../common/mysql-connection');
const MetaResponseMapper = require('../mappers/meta-response-mapper');

exports.handle = (request, response, connection, format) => {
    const locationCode = request.body.locationCode;
    const paramMissing = locationCode === undefined || locationCode === null || locationCode === '';
    if (paramMissing) {
        response.status(500).send({
            success: false,
            error: "Missing required request body field: 'locationCode'"
        }).end();
    }

    // open the connection:
    connection.connect();

    try {
        const sqlQuery = `SELECT 
                              LocationCode, 
                              Version 
                          FROM 
                              Locations 
                          WHERE 
                              LocationCode = '${locationCode}'`;
        const res = connection.query(sqlQuery, function (error, results, fields) {
            if (error) {
                console.error(error.toString());
                response.status(500).send({
                    success: false,
                    error: 'An error has occured while trying to fetch location version'
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
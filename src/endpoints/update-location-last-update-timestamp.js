const MetaResponseMapper = require('../mappers/meta-response-mapper');

exports.handle = (request, response, connection, format) => {
    const lastUpdateTimeStamp = request.body.lastUpdateTimeStamp;
    let missingParams = [];
    if (lastUpdateTimeStamp === undefined || lastUpdateTimeStamp === null || lastUpdateTimeStamp.trim() === '') {
        missingParams.push('lastUpdateTimeStamp');
    }; 
    if (missingParams.length > 0) {
        response.status(500).send({
            success: false,
            error: `Missing the following required parameter(s): '${missingParams.join("', '")}'`
        }).end();
    }

    // open the connection:
    connection.connect();

    try {
        const sqlQuery = `UPDATE Locations SET LastUpdateTimeStamp = '\`${lastUpdateTimeStamp}\`'`;

        const res = connection.query(sqlQuery, function (error, results, fields) {
            if (error) {
                console.error(error.toString());
                response.status(500).send({
                    success: false,
                    error: 'An error has occured while trying to update locations\' last update timestamp'
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

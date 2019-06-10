const mySqlConnection = require('../common/mysql-connection');
const MetaResponseMapper = require('../mappers/meta-response-mapper');

exports.handle = (request, response, connection, format) => {
    const locationCode = request.body.locationCode;
    const key = request.body.key;
    const cancelledTimeStamp = request.body.cancelledTimeStamp;
    let missingParams = [];
    if (locationCode === undefined || locationCode === null || locationCode.trim() === '') {
        missingParams.push('locationCode');
    };
    if (key === undefined || key === null || key.trim() === '') {
        missingParams.push('key');
    };
    if (cancelledTimeStamp === undefined || cancelledTimeStamp === null || cancelledTimeStamp.trim() === '') {
        missingParams.push('cancelledTimeStamp');
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
        const sqlQuery = `UPDATE apcshead t1
                          LEFT JOIN apcsitem t2 ON t1.locationCode = t2.locationCode AND t1.\`Key\` = t2.HeadKey
                          LEFT JOIN apcstend t3 ON t1.locationCode = t3.locationCode AND t1.\`Key\` = t3.Tran
                          LEFT JOIN aptax t4 ON t1.locationCode = t4.locationCode AND t1.\`Key\` = t4.\`Key\`
                          SET t1.CancelledTimeStamp = '${cancelledTimeStamp}',
                              t2.CancelledTimeStamp = '${cancelledTimeStamp}',
                              t3.CancelledTimeStamp = '${cancelledTimeStamp}',
                              t4.CancelledTimeStamp = '${cancelledTimeStamp}'
                          WHERE 
                              t1.\`Key\` = '${key}' AND
                              t1.LocationCode = '${locationCode}' AND
                              t1.CancelledTimeStamp IS NULL`;

        const res = connection.query(sqlQuery, function (error, results, fields) {
            if (format.toLowerCase() === 'xml') {
                response.set('Content-Type', 'text/xml');
            } else {
                response.set('Content-Type', 'application/json');
            }
            if (error) {
                console.error(error.toString());
                const mapper = new MetaResponseMapper();
                const mappedResponse = mapper.getMappedMetaResponse({
                    success: false,
                    error: 'An error has occured while trying to cancel an order'
                });
                response.status(500).send(mappedResponse).end();
            } else {
                // closing the connection only inside the callback to prevent a race condition:
                connection.end();
                const mapper = new MetaResponseMapper();
                const mappedResponse = mapper.getMappedMetaResponse({
                    success: false,
                    results
                });
                response.status(200).send(mappedResponse).end();
            }
        });
    } catch (e) {
        console.error(e.toString());
    }
};

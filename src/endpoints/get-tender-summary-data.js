const MetaResponseMapper = require('../mappers/meta-response-mapper');

exports.handle = (request, response, connection, format) => {
    let locationCodes = request.body.locationCodes;
    let dateInvoicedFrom = request.body.dateInvoicedFrom;
    let dateInvoicedThru = request.body.dateInvoicedThru;

    let missingParams = [];
    if (dateInvoicedFrom === undefined || dateInvoicedFrom === null || dateInvoicedFrom.trim() === '') {
        missingParams.push('dateInvoicedFrom');
    };
    if (dateInvoicedThru === undefined || dateInvoicedThru === null || dateInvoicedThru.trim() === '') {
        missingParams.push('dateInvoicedThru');
    };
    if (missingParams.length > 0) {
        response.status(500).send({
            success: false,
            error: `Missing the following required parameter(s): '${missingParams.join("', '")}'`
        }).end();
    }
    let whereConditions = [];
    if (locationCodes !== undefined && locationCodes !== null) {
        locationCodes = JSON.parse(locationCodes).map((locationCode) => `'${locationCode}'`);
        if (locationCodes.length > 0) {
            whereConditions.push(`header.\`LocationCode\` IN (${locationCodes.join(',')})`);
        }
    }
    whereConditions.push(`\`header.DateInvoiced\` >= '${dateInvoicedFrom}'`);
    whereConditions.push(`\`header.DateInvoiced\` <= '${dateInvoicedThru}'`);
    const whereClause = whereConditions.length > 0 ? ` WHERE ${whereConditions.join(" AND ")} ` : "";
    // open the connection:
    connection.connect();
    try {
        const sqlQuery = `SELECT 
                              DISTINCT \`Category\`
                          FROM 
                              apcshead AS header 
                          INNER JOIN 
                              apcstend AS tend ON header.key = tend.tran and header.LocationCode = tend.LocationCode
                          ${whereClause} 
                          ORDER BY tend.LocationCode`;
        const res = connection.query(sqlQuery, function (error, results, fields) {
            if (error) {
                console.error(error.toString());
                response.status(500).send({
                    success: false,
                    error: 'An error has occured while trying to fetch tender summary data'
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
const ItemCategoriesMapper = require('../mappers/item-categories-mapper');
const MetaResponseMapper = require('../mappers/meta-response-mapper');

exports.handle = (request, response, connection, format) => {
    let locationCodes = request.body.locationCodes;
    let whereClause = "";
    if (locationCodes !== undefined && locationCodes !== null && locationCodes.trim() !== '') {
        locationCodes = JSON.parse(locationCodes).map((locationCode) => `'${locationCode}'`);
        if (locationCodes.length > 0) {
            whereClause = ` WHERE \`LocationCode\` IN (${locationCodes.join(',')}) `;
        }
    }

    // open the connection:
    connection.connect();
    try {
        const sqlQuery = `SELECT 
                              DISTINCT \`Category\`
                          FROM 
                              apcsitem ${whereClause} ORDER BY \`Category\``;
        const res = connection.query(sqlQuery, function (error, results, fields) {
            if (format.toLowerCase() === 'xml') {
                response.set('Content-Type', 'text/xml');
            } else {
                response.set('Content-Type', 'application/json');
            }
            if (error) {
                console.error(error.toString());
                response.status(500).send({
                    success: false,
                    error: 'An error has occured while trying to fetch item categories'
                }).end();
            } else {
                // closing the connection only inside the callback to prevent a race condition:
                connection.end();
                const mapper = new ItemCategoriesMapper();
                const mappedResults = mapper.getMappedItemCategories({
                    success: true,
                    results
                }, format);
                response.status(200).send(mappedResults).end();
            }
        });
    } catch (e) {
        console.error(e.toString());
    }
};
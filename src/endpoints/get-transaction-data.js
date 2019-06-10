const OrdersMapper = require('../mappers/orders-mapper');
const moment = require('moment');
const MetaResponseMapper = require('../mappers/meta-response-mapper');

exports.handle = (request, response, connection, format) => {
    let locationCodes = request.body.locationCodes;
    let serverId = request.body.serverId;
    let dateInvoicedFrom = request.body.dateInvoicedFrom;
    let dateInvoicedThru = request.body.dateInvoicedThru;
    let resetTill = request.body.resetTill;
    let resetSequence = request.body.resetSequence;
    let itemTypes = request.body.itemTypes;
    
    let whereConditions = [];
    if (locationCodes !== undefined && locationCodes !== null && locationCodes.trim() !== '') {
        locationCodes = JSON.parse(locationCodes).map((locationCode) => `'${locationCode}'`);
        if (locationCodes.length > 0) {
            whereConditions.push(`header.\`LocationCode\` IN (${locationCodes.join(',')})`);
        }
    }
    
    if (resetSequence !== undefined && resetSequence !== null) { 
        whereConditions.push(`\`header.Znum\` = ${resetSequence}`);
    }

    if (resetTill !== undefined && resetTill !== null) { 
        whereConditions.push(`\`header.ZTill\` = '${resetTill}'`);
    }

    if (serverId !== undefined && serverId !== null) { 
        whereConditions.push(`\`header.ServerId\` = '${serverId}'`);
    }

    if (dateInvoicedFrom !== undefined && dateInvoicedFrom !== null && dateInvoicedThru !== undefined && dateInvoicedThru !== null) { 
        whereConditions.push(`\`header.DateInvoiced\` >= '${dateInvoicedFrom}'`);
        whereConditions.push(`\`header.DateInvoiced\` <= '${dateInvoicedThru}'`);
    }

    const whereClause = whereConditions.length > 0 ? ` WHERE ${whereConditions.join(" AND ")} ` : "";
    
    // open the connection:
    connection.connect();

    try {
        const sqlQuery = `SELECT 
                              header.*,
                              item.*
                          FROM 
                              apcshead AS header
                          LEFT JOIN 
                              apcsitem AS item ON header.\`Key\` = item.\`HeadKey\` 
                          ${whereClause} 
                          ORDER BY header.\`Key\` + 0 ASC`;
        

        const typeCastCallback = (field, next) => {
            if (field.type === 'BIT' && field.length == 1) {
              return field.string() === '1'; 
            }
            if (field.type === 'DATETIME' && field.length > 1) {
                return moment(field.string()).format('YYYY-MM-DDTHH:mm:ssZ');
            }
            return next();
        };
        const queryOptions = {
            sql: sqlQuery, 
            nestTables: '_',
            typeCast: typeCastCallback
        };
        const res = connection.query(queryOptions, function (error, results, fields) {
            if (error) {
                console.error(error.toString());
                response.status(500).send({
                    success: false,
                    error: 'An error has occured while trying to fetch transaction data'
                }).end();
            } else {
                // closing the connection only inside the callback to prevent a race condition:
                connection.end();
                const mapper = new OrdersMapper;
                const mappedResults = mapper.getMappedTransactions({
                    success: true,
                    results
                }, format);
                if (format.toLowerCase() === 'xml') {
                    response.set('Content-Type', 'text/xml');
                } else {
                    response.set('Content-Type', 'application/json');
                }
                response.status(200).send(mappedResults).end();
            }
        });
    } catch (e) {
        console.error(e.toString());
    }
};
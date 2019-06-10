const mySqlConnection = require('../common/mysql-connection');
const MetaResponseMapper = require('../mappers/meta-response-mapper');

exports.handle = (request, response, connection, format) => {
    let orderHeaders = request.body.orderHeaders;
    const paramMissing = orderHeaders === undefined || orderHeaders === null || JSON.parse(orderHeaders).length === 0;
    if (paramMissing) {
        response.status(500).send({
            success: false,
            error: "Missing or empty required request body field: 'orderHeaders'."
        }).end();
    }
    orderHeaders = JSON.parse(orderHeaders);

    // open the connection:
    connection.connect();

    try {
        if (orderHeaders.length > 0) {
            let ordersSet = [];
            const keys = Object.keys(orderHeaders[0]).map((key) => `\`${key}\``).join(',');
            for (var i = 0; i < orderHeaders.length; i++) {
                let currentOrder = Object.keys(orderHeaders[i]).map(function(key) {
                    return orderHeaders[i][key];
                });
                ordersSet.push(currentOrder);
            }
            
            const headInsertStatement = `INSERT INTO apcshead (${keys}) VALUES ?`;
            
            const query = connection.query(headInsertStatement, [ordersSet], function(error, results, fields) {
                if (error) {
                    console.error(error.toString());
                    response.status(500).send({
                        success: false,
                        error: "Could not create order headers"
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
        }
    } catch (e) {
        console.error(e.toString());
        response.status(500).send({
            success: false,
            error: "Could not create order headers"
        }).end();
    }
};

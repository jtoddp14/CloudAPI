const mySqlConnection = require('../common/mysql-connection');
const MetaResponseMapper = require('../mappers/meta-response-mapper');

exports.handle = (request, response, connection, format) => {
    let orderItems = request.body.orderItems;
    const paramMissing = orderItems === undefined || orderItems === null || JSON.parse(orderItems).length === 0;
    
    if (paramMissing) {
        response.status(500).send({
            success: false,
            error: "Missing or empty required request body field: 'orderItems'."
        }).end();
    }

    orderItems = JSON.parse(orderItems);
    
    // open the connection:
    connection.connect();
                             
    try {
        if (orderItems.length > 0) {

            let itemsSet = [];
            const keys = Object.keys(orderItems[0]).map((key) => `\`${key}\``).join(',');
            for (var i = 0; i < orderItems.length; i++) {
                let currentItem = Object.keys(orderItems[i]).map(function(key) {
                    return orderItems[i][key];
                });
                itemsSet.push(currentItem);
            }
            
            const itemInsertStatement = `INSERT INTO apcsitem (${keys}) VALUES ?`;


            connection.query(itemInsertStatement, [itemsSet], function(error, results, fields) {
                if (error) {
                    console.error(error.toString());
                    response.status(500).send({
                        success: false,
                        error: "Could not create order items"
                    }).end();
                } else {
                    console.log(`Inserted ${results.affectedRows} rows to 'apcsitems' table`);
                    // closing the connection only inside the callback to prevent a race condition:
                    connection.end();
                    response.status(200).send({
                        success: true,
                        orderItemsCount: results.affectedRows
                    }).end();
                }
            });
        }
    } catch (e) {
        console.error(e.toString());
        response.status(500).send({
            success: false,
            error: "Could not create order items"
        }).end();
    }
};

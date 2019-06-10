const MetaResponseMapper = require('../mappers/meta-response-mapper');

exports.handle = (request, response, connection, format) => {
    let orderTends = request.body.orderTends;
    const paramMissing = orderTends === undefined || orderTends === null || JSON.parse(orderTends).length === 0;
    if (paramMissing) {
        response.status(500).send({
            success: false,
            error: "Missing or empty required request body field: 'orderTends'."
        }).end();
    }
    orderTends = JSON.parse(orderTends);

    // open the connection:
    connection.connect();

    try {
        if (orderTends.length > 0) {

            let tendsSet = [];
            const keys = Object.keys(orderTends[0]).map((key) => `\`${key}\``).join(',');
            for (var i = 0; i < orderTends.length; i++) {
                let currentTend = Object.keys(orderTends[i]).map(function(key) {
                    return orderTends[i][key];
                });
                tendsSet.push(currentTend);
            }
            
            const tendInsertStatement = `INSERT INTO apcstend (${keys}) VALUES ?`;
            let query = connection.query(tendInsertStatement, [tendsSet], function(error, results) {
                if (error) {
                    console.error(error.toString());
                    response.status(500).send({
                        success: false,
                        error: "Could not create order tends"
                    }).end();
                } else {
                    // closing the connection only inside the callback to prevent a race condition:
                    connection.end();
                    const affectedRows = results === undefined ? 'unknown' : results.affectedRows;
                    console.log(`Inserted ${affectedRows} rows to 'apcstend' table`);
                    response.status(200).send({
                        success: true,
                        orderTendsCount: affectedRows
                    }).end();
                }
            });
        }
    } catch (e) {
        console.error(e.toString());
        response.status(500).send({
            success: false,
            error: "Could not create order tends"
        }).end();
    }
};

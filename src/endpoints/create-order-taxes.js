const MetaResponseMapper = require('../mappers/meta-response-mapper');

exports.handle = (request, response, connection, format) => {
    let orderTaxes = request.body.orderTaxes;
    const paramMissing = orderTaxes === undefined || orderTaxes === null || JSON.parse(orderTaxes).length === 0;
    if (paramMissing) {
        response.status(500).send({
            success: false,
            error: "Missing or empty required request body field: 'orderTaxes'."
        }).end();
    }
    orderTaxes = JSON.parse(orderTaxes);

    // open the connection:
    connection.connect();

    try {
        if (orderTaxes.length > 0) {
            let taxesSet = [];
            const keys = Object.keys(orderTaxes[0]).map((key) => `\`${key}\``).join(',');
            for (var i = 0; i < orderTaxes.length; i++) {
                let currentTax = Object.keys(orderTaxes[i]).map(function(key) {
                    return orderTaxes[i][key];
                });
                taxesSet.push(currentTax);
            }
            
            const taxInsertStatement = `INSERT INTO aptax (${keys}) VALUES ?`;
            const query = connection.query(taxInsertStatement, [taxesSet], function(error, results, fields) {
                if (error) {
                    console.error(error.toString());
                    response.status(500).send({
                        success: false,
                        error: "Could not create order taxes"
                    }).end();
                } else {
                    // closing the connection only inside the callback to prevent a race condition:
                    connection.end();
                    const affectedRows = results === undefined ? 'unknown' : results.affectedRows;
                    console.log(`Inserted ${affectedRows} rows to 'aptax' table`);
                    response.status(200).send({
                        success: true,
                        orderTaxesCount: affectedRows
                    }).end();
                }
            });
        }
    } catch (e) {
        console.error(e.toString());
        response.status(500).send({
            success: false,
            error: "Could not create order taxes"
        }).end();
    }
};

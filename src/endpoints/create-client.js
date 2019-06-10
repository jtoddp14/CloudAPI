const MetaResponseMapper = require('../mappers/meta-response-mapper');
const Hash = require('../common/hash');

exports.handle = (request, response, connection, format) => {
    const clientSerialNumber = request.body.clientSerialNumber;
    const clientAccessToken = request.body.clientAccessToken;
    const databaseName = request.body.databaseName;
    const mapper = new MetaResponseMapper();
    let missingParams = [];
    
    if (clientSerialNumber === undefined || clientSerialNumber === null || clientSerialNumber.trim() === '') {
        missingParams.push('clientSerialNumber');
    };
    if (clientAccessToken === undefined || clientAccessToken === null || clientAccessToken.trim() === '') {
        missingParams.push('clientAccessToken');
    };
    if (databaseName === undefined || databaseName === null || databaseName.trim() === '') {
        missingParams.push('databaseName');
    };

    if (missingParams.length > 0) {
        const mappedResponse = mapper.getMappedMetaResponse({ success: false, error: `Missing the following required parameter(s): '${missingParams.join("', '")}'`}, format);
        response.status(500).send(mappedResponse).end();
    } else {
        const isActive = 1;
        const hash = new Hash(clientAccessToken);
        const { salt, accessTokenHash } = hash.getAccessTokenHashWithSaltAndPepper();

        const sqlQuery = `
            INSERT INTO \`clientAccess\`
                (\`serialNumber\`, \`databaseName\`, \`isActive\`, \`accessTokenSalt\`, \`accessTokenHash\`)
            VALUES
                ('${clientSerialNumber}', '${databaseName}', ${isActive}, '${salt}', '${accessTokenHash}')`;

        // open the connection:
        connection.connect();
        const query = connection.query(sqlQuery, function (error, results, fields) {
            if (error) {
                console.error('There was a problem executing the SQL CREATE statement for the desired tables');
                console.error(error.toString());
                const mappedResponse = mapper.getMappedMetaResponse({ success: false, error: 'Could not create client entry in the database'}, format);
                response.status(500).send(mappedResponse).end();
            } else {
                // closing the connection only inside the callback to prevent a race condition:
                connection.end();
                console.log(`Created a client entry with the following serial number: ${clientSerialNumber}`); 
                const mappedResponse = mapper.getMappedMetaResponse({ success: true, results }, format);
                response.status(200).send(mappedResponse).end();
            }
        });
    }
};

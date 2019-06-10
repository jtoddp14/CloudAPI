const Connection = require('../common/mysql-connection');
const MetaResponseMapper = require('../mappers/meta-response-mapper');

exports.handle = (request, response, format, requiresAdmin, callback) => {
    format = typeof format === 'undefined' ? 'json' : format;
    const mapper = new MetaResponseMapper();
    let mappedResponse;
    
    const authHeader = request.get('Authorization');
    let serialNumber = null;
    let accessToken = null;
    if (typeof authHeader !== 'undefined' && authHeader !== null && authHeader.length > 0) {
        const matches = authHeader.match(/^Bearer\s+([^\s]+):([^\s]+)$/);
        if (matches && matches.length > 2) {
            serialNumber = matches[1];
            accessToken = matches[2];
        }    
    }
    
    
    if (request.method !== 'POST') {
        mappedResponse = mapper.getMappedMetaResponse({ 
            success: false, 
            error: `Unauthorized ${request.method} request - only POST requests are allowed`,
        }, format);
        response.status(405).send({ mappedResponse, rawBody: request.rawBody }).end();
    }

    const accessTokenMissing = accessToken === undefined || accessToken === null || accessToken.trim().length === 0;
    const serialNumberMissing = serialNumber === undefined || serialNumber === null || serialNumber.trim().length === 0;

    if (serialNumberMissing || accessTokenMissing) {
        console.log('Unauthorized request - access token or serial number missing');
        const mappedResponse = mapper.getMappedMetaResponse({ 
            success: false, 
            error: "Could not authenticate the request: both 'accessToken' and 'serialNumber' parameters are required" 
        }, format);
        response.status(405).send(mappedResponse).end();
    }
    const connection = new Connection();
    connection.authenticateOrReject(serialNumber, accessToken, request, response, format, requiresAdmin, callback);
};

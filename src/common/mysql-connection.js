const mysql = require('mysql');
const Hash = require('../common/hash');
const Config = require('../common/config');
const MetaResponseMapper = require('../mappers/meta-response-mapper');

class Connection {

    constructor(serialNumber) {
        const config = (new Config()).get();

        const socketPath             = config.database.socketPath;
        const user                    = config.database.user;
        const password                = config.database.password;
        const masterSchema            = config.database.masterSchema;
        const multipleStatements     = config.database.allowMultipleStatements;

        this.masterDbConnectionDetails = {
            socketPath,
            user,
            password,
            database: masterSchema,
            multipleStatements
        };
        this.connectionDetails = Object.assign({}, this.masterDbConnectionDetails);
        this.authDone = false;
    }

    authenticateOrReject(serialNumber, accessToken, request, response, format, requiresAdminRights, callback) {
        const connection = this.getMasterConnection();
        const mapper = new MetaResponseMapper();
        connection.connect();
        
        const sqlQuery = `
            SELECT
                \`serialNumber\`,
                \`accessTokenHash\`,
                \`accessTokenSalt\`,
                \`databaseName\`,
                \`isActive\`,
                \`isAdmin\`
            FROM
                \`clientAccess\`
            WHERE
                \`serialNumber\` = '${serialNumber}'`;

        let that = this;
        const query = connection.query(sqlQuery, function (error, results, fields) {
            if (error) {
                console.error('There was a problem executing the SQL authentication statement');
                console.error(error.toString());
                const mappedResponse = mapper.getMappedMetaResponse({
                    success: false, 
                    error: 'Connection error, please try again later' 
                }, format);
                response.status(500).send(mappedResponse).end();
            } else {
                // closing the connection only inside the callback to prevent a race condition:
                connection.end();
                let accessTokenHash;
                let accessTokenSalt;
                let databaseName;
                let isActive;
                let isAdmin;
                let success = false;
                let notAllowed = false;
                let inactiveClient = false;
                let error;
                if (results && results.length > 0) {
                    accessTokenHash = results[0].accessTokenHash;
                    accessTokenSalt = results[0].accessTokenSalt;
                    isActive = results[0].isActive;
                    isAdmin = results[0].isAdmin;
                    notAllowed = requiresAdminRights && !isAdmin;

                    databaseName = results[0].databaseName;
                    const hash = new Hash(accessToken);
                    if (!isActive) {
                        success = false;
                        error = "The client you are using is inactive";
                    } else if (notAllowed) {
                        success = false;
                        error = "The client you are using is not allowed to perform this action";
                    } else if (hash.getAccessTokenHashWithSaltAndPepper(accessTokenSalt).accessTokenHash === accessTokenHash) {
                        success = true;
                    } else {
                        error = "Authentication failed (are you using the right serial number/access token?)";
                        success = false;
                    }
                } else {
                    error = "Authentication failed (are you using the right serial number/access token?)";
                }
                if (!success) {
                    const mappedResponse = mapper.getMappedMetaResponse({ 
                        success: false, 
                        error
                    }, format);
                    response.status(405).send(mappedResponse).end();
                } else {
                    callback(request, response, that.getConnection(databaseName), format);
                }
            }
        });
    }

    getConnection(database) {
        if (this.connectionDetails === undefined || this.connectionDetails === null) {
            throw "Connection not initialized";
        }
        const connectionDetails = Object.assign({}, this.connectionDetails, { database });
        return mysql.createConnection(connectionDetails);
    }

    getMasterConnection() {
        if (this.masterDbConnectionDetails === undefined || this.masterDbConnectionDetails === null) {
            throw "Connection not initialized";
        }
        return mysql.createConnection(this.masterDbConnectionDetails);
    }
}

module.exports = Connection;

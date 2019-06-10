const fileSystem = require('../common/file-system');
const MetaResponseMapper = require('../mappers/meta-response-mapper');

const headTablePath = 'assets/sql/apcshead.sql';
const itemTablePath = 'assets/sql/apcsitem.sql';
const tendTablePath = 'assets/sql/apcstend.sql';
const taxTablePath = 'assets/sql/aptax.sql';
const locationsTablePath = 'assets/sql/locations.sql';

exports.handle = (request, response, connection, format) => {
    const mapper = new MetaResponseMapper();
    const talblesDdl = [
        fileSystem.readFile(headTablePath),
        fileSystem.readFile(itemTablePath),
        fileSystem.readFile(tendTablePath),
        fileSystem.readFile(taxTablePath),
        fileSystem.readFile(locationsTablePath)
    ];

    // open the connection:
    connection.connect();
    const query = connection.query(talblesDdl.join(' '), function (error, results, fields) {
        if (error) {
            console.error('There was a problem executing the SQL CREATE statement for the desired tables');
            console.error(error.toString());
            const mappedResponse = mapper.getMappedMetaResponse({ success: false, error: 'Could not create database tables' }, format);
            response.status(500).send(mappedResponse).end();
        } else {
            // closing the connection only inside the callback to prevent a race condition:
            connection.end();
            console.log(`Tables are ready in the database`); 
            const mappedResponse = mapper.getMappedMetaResponse({ success: true, results }, format);
            response.status(200).send(mappedResponse).end();
        }
    });
};
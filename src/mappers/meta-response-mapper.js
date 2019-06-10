const xmlParser = require('js2xmlparser');
const BaseMapper = require('../mappers/base-mapper');

class MetaResponseMapper extends BaseMapper {
    
    constructor() { 
        super();
    }

    getMappedMetaResponse(response, format) {
        if (response.success) {
            if (response.results.contructor !== Array) {
                response.results = { 
                    affectedRows: this.defaultsToIfNull(response.results.affectedRows, 0),
                    changedRows: this.defaultsToIfNull(response.results.changedRows, 0) 
                };
            }
        }

        if (format.toLowerCase() === 'xml') {
            return xmlParser.parse("response", response); 
        }
        return response;
    }
}

module.exports = MetaResponseMapper;

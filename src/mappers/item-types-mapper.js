const xmlParser = require('js2xmlparser');
const BaseMapper = require('../mappers/base-mapper');

class ItemTypesMapper extends BaseMapper {

    getMappedItemTypes(response, format) {
        response.results = { 
            ITypes: response.results.map(
                (type) => this.defaultsToIfNull(type.IType, '')
            )
        };

        if (format.toLowerCase() === 'xml') {
            const options = {
                wrapHandlers: {
                    "ITypes": (key, value) => "Itype"
                }
            };
            return xmlParser.parse("response", response, options); 
        }
        return response;
    }
}

module.exports = ItemTypesMapper;

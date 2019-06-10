const xmlParser = require('js2xmlparser');
const BaseMapper = require('../mappers/base-mapper');

class ItemCategoriesMapper extends BaseMapper {

    getMappedItemCategories(response, format) {
        response.results = { 
            Categories: response.results.map(
                (category) => this.defaultsToIfNull(category.Category, '')
            )
        };

        if (format.toLowerCase() === 'xml') {
            const options = {
                wrapHandlers: {
                    "Categories": (key, value) => "Category"
                }
            };
            return xmlParser.parse("response", response, options); 
        }
        return response;
    }
}

module.exports = ItemCategoriesMapper;

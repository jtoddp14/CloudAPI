const authenticate = require('./src/common/authenticate');
const createTables = require('./src/endpoints/create-tables');
const getLocationVersion = require('./src/endpoints/get-location-version');
const createOrderHeaders = require('./src/endpoints/create-order-headers');
const createOrderItems = require('./src/endpoints/create-order-items');
const createOrderTends = require('./src/endpoints/create-order-tends');
const createOrderTaxes = require('./src/endpoints/create-order-taxes');
const cancelOrder = require('./src/endpoints/cancel-order');
const updateLocationLastUpdateTimestamp = require('./src/endpoints/update-location-last-update-timestamp');
const getAllLocations = require('./src/endpoints/get-all-locations');
const getTransactionData = require('./src/endpoints/get-transaction-data');
const getItemTypes = require('./src/endpoints/get-item-types');
const getItemCategories = require('./src/endpoints/get-item-categories');
const getTenderSummaryData = require('./src/endpoints/get-tender-summary-data');
const createClient = require('./src/endpoints/create-client');
const RequestFormat = require('./src/common/request-format');
const Connection = require('./src/common/mysql-connection');

exports.createTables = (request, response) => {
    const requestFormat = (new RequestFormat(request)).getFormat();    
    authenticate.handle(request, response, requestFormat, false,
        (rq, rs, cn, fm) => {
            createTables.handle(rq, rs, cn, fm);
        }
    );
};
exports.getLocationVersion = (request, response) => {
    const requestFormat = (new RequestFormat(request)).getFormat();    
    authenticate.handle(request, response, requestFormat, false,
        (rq, rs, cn, fm) => {
            getLocationVersion.handle(rq, rs, cn, fm);
        }
    );
};
exports.createOrderHeaders = (request, response) => {
    const requestFormat = (new RequestFormat(request)).getFormat();    
    authenticate.handle(request, response, requestFormat, false,
        (rq, rs, cn, fm) => {
            createOrderHeaders.handle(rq, rs, cn, fm);
        }
    );
};
exports.createOrderItems = (request, response) => {
    const requestFormat = (new RequestFormat(request)).getFormat();    
    authenticate.handle(request, response, requestFormat, false,
        (rq, rs, cn, fm) => {
            createOrderItems.handle(rq, rs, cn, fm);
        }
    );
};
exports.createOrderTends = (request, response) => {
    const requestFormat = (new RequestFormat(request)).getFormat();    
    authenticate.handle(request, response, requestFormat, false,
        (rq, rs, cn, fm) => {
            createOrderTends.handle(rq, rs, cn, fm);
        }
    );
};
exports.createOrderTaxes = (request, response) => {
    const requestFormat = (new RequestFormat(request)).getFormat();    
    authenticate.handle(request, response, requestFormat, false,
        (rq, rs, cn, fm) => {
            createOrderTaxes.handle(rq, rs, cn, fm);
        }
    );
};
exports.cancelOrder = (request, response) => {
    const requestFormat = (new RequestFormat(request)).getFormat();    
    authenticate.handle(request, response, requestFormat, false,
        (rq, rs, cn, fm) => {
            cancelOrder.handle(rq, rs, cn, fm);
        }
    );
};
exports.updateLocationLastUpdateTimestamp = (request, response) => {
    const requestFormat = (new RequestFormat(request)).getFormat();    
    authenticate.handle(request, response, requestFormat, false,
        (rq, rs, cn, fm) => {
            updateLocationLastUpdateTimestamp.handle(rq, rs, cn, fm);
        }
    );
};
exports.getAllLocations = (request, response) => {
    const requestFormat = (new RequestFormat(request)).getFormat();    
    authenticate.handle(request, response, requestFormat, false,
        (rq, rs, cn, fm) => {
            getAllLocations.handle(rq, rs, cn, fm);
        }
    );
};
exports.getTransactionData = (request, response) => {
    const requestFormat = (new RequestFormat(request)).getFormat();    
    authenticate.handle(request, response, requestFormat, false,
        (rq, rs, cn, fm) => {
            getTransactionData.handle(rq, rs, cn, fm);
        }
    );
};
exports.getItemTypes = (request, response) => {
    const requestFormat = (new RequestFormat(request)).getFormat();    
    authenticate.handle(request, response, requestFormat, false,
        (rq, rs, cn, fm) => {
            getItemTypes.handle(rq, rs, cn, fm);
        }
    );
};
exports.getItemCategories = (request, response) => {
    const requestFormat = (new RequestFormat(request)).getFormat();    
    authenticate.handle(request, response, requestFormat, false,
        (rq, rs, cn, fm) => {
            getItemCategories.handle(rq, rs, cn, fm);
        }
    );
};
exports.getTenderSummaryData = (request, response) => {
    const requestFormat = (new RequestFormat(request)).getFormat();    
    authenticate.handle(request, response, requestFormat, false,
        (rq, rs, cn, fm) => {
            getTenderSummaryData.handle(rq, rs, cn, fm);
        }
    );
};
exports.createClient = (request, response) => {
    const requestFormat = (new RequestFormat(request)).getFormat();    
    authenticate.handle(request, response, requestFormat, true,
        (rq, rs, cn, fm) => {
            createClient.handle(rq, rs, cn, fm);
        }
    );
};

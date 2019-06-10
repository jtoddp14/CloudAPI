class RequestFormat {
    
    constructor(request) {
        if (request === undefined || request.body === undefined) {
            throw "Invalid request passed to RequestFormat, cannot resolve format";
        }
        this.format = (request.body.format === undefined || request.body.format === null) ? 'json' : request.body.format;
    }

    getFormat() {
        return this.format;
    }
    
}

module.exports = RequestFormat;
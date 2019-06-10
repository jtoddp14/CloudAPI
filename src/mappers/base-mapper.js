class BaseMapper {
    constructor() {
        if (new.target === BaseMapper) {
            throw new TypeError("Cannot construct Abstract class BaseMapper instances directly");
        }
    }
    
    defaultsToIfNull(value, defaultsTo) {
        return value || defaultsTo;
    }
}

module.exports = BaseMapper;

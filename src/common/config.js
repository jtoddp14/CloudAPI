const fileSystem = require('../common/file-system');

class Config {
    constructor() {
        this.config = JSON.parse(fileSystem.readFile('config.json'));
    }

    get() {
        return this.config;
    }
}

module.exports = Config;

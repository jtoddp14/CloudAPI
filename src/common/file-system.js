const fs = require('fs');

exports.readFile = (path) => {
    return fs.readFileSync(path).toString();
};
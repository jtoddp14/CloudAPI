const crypto = require('crypto');
const Config = require('../common/config');

class Hash {
    constructor(accessToken) {
        this.accessToken = accessToken;
    }

    getRandomSalt(length) {
        length = typeof length === 'undefined' ? 56 : length;
        return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
    };

    getAccessTokenHash(salt) {
        salt = typeof salt === 'undefined' ? this.getRandomSalt() : salt;
        return this.sha512(salt);
    }

    getAccessTokenHashWithSaltAndPepper(salt) {
        const config = (new Config()).get();
        const { pepper } = config.authentication;
        salt = typeof salt === 'undefined' ? this.getRandomSalt() : salt;
        return this.sha512(salt, pepper);
    }

    sha512(salt, pepper) {
        pepper = typeof pepper === 'undefined' || pepper === null ? '' : pepper;
        const hash = crypto.createHmac('sha512', salt + pepper);
        hash.update(this.accessToken);
        const value = hash.digest('hex');
        return {
            salt: salt,
            accessTokenHash: value
        };
    }
}

module.exports = Hash;
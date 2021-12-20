const crypto = require("crypto");

// fucntion to generate hash
function getHash(message) {
    if (message !== undefined) {
        return crypto.createHash('sha256').update(message).digest('hex');
    } else {
        throw new Error('Message is required');
    }
}

module.exports = getHash;
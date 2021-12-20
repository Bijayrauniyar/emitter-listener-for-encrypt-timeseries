const crypto = require("crypto");

function getHash(message) {
    if (message !== undefined) {
        return crypto.createHash('sha256').update(message).digest('hex');
    } else {
        throw new Error('Message is required');
    }
  
  }

module.exports = getHash;
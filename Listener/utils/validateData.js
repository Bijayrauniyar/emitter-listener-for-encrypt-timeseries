const getHash = require("./getHash");

//validate if the decrypted data arrived is corrupted or not
const validateData = (message) => {
    try {
        message = JSON.parse(message);
        let data = {
            name: message.name,
            origin: message.origin,
            destination: message.destination
        }
        let generatehash = getHash(JSON.stringify(data)); // hash recieved message

        if (generatehash !== message.secret_key) {
            throw new Error("Invalid request");
        }
    }
    catch (err) {
        console.log("Error caught while validating", err);
    }
}


module.exports = validateData;
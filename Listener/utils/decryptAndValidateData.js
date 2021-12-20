const crypto = require("crypto");
const validateData = require("./getHash");

// fucntion to decrypt and validate data
const decryptAndValidateData = async (incomingData, time) => {
    const decryptData = [];
    let failCount = 0;

    const iv = process.env.INITIALIZATION_VECTOR;
    const key = process.env.ENCRYPT_DECRYPT_KEY;

    try {
        incomingData.forEach((element) => {
            const decrypter = crypto.createDecipheriv("aes-256-ctr", key, iv);
            let decryptedMsg = decrypter.update(element, "hex", "utf8");
            decryptedMsg += decrypter.final("utf8");

            try {
                validateData(decryptedMsg); // validate incomming data

                // Added timestamp to validated data
                decryptedMsg["timestamp"] = time;

                decryptData.push(decryptedMsg);
            } catch (error) {
                ++failCount;
            }
        });
        const failureRate = (failCount / decryptData.length) * 100;

        return { decryptData, failureRate };
    } catch (err) {
        console.log(err);
    }
};
module.exports = decryptAndValidateData;
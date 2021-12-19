require("dotenv").config();
const { WebSocketServer } = require("ws");
const crypto = require("crypto");

const wsServer = new WebSocketServer({ port: 3001 });

//function to generate hash
function getHash(message) {
    if (message !== undefined) {
        return crypto.createHash('sha256').update(message).digest('hex');
    } else {
        throw new Error('Message is required');
    }

}

//validate if the decrypted data arrived is corrupted or not
const validateData = (message) => {
    try {
        message = JSON.parse(message);
        let data = {
            name: message.name,
            origin: message.origin,
            destination: message.destination
        }
        console.log(message, 'message for validate')
        let generatehash = getHash(JSON.stringify(data));
        
        
        console.log('extracted data from encrypted message', data, '\n');

        if (generatehash !== message.secret_key) {
            throw new Error("Invalid request");
        }
    }
    catch (err) {
        console.log("Error caught while validating", err);
    }
}



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
                validateData(decryptedMsg);

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

wsServer.on("connection", (socket) => {
    socket.on("message", async (message) => {
        const incomingData = message.toString().split("|");
        const time = new Date(new Date());
        try {
            const { decryptData, failureRate } = await decryptAndValidateData(
                incomingData,
                time
            );
            console.log(decryptedMsg, 'validate and decrypt incomming message');
        } catch (err) {
            console.log(err);
        }
    });
});

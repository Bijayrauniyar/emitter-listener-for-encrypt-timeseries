require("dotenv").config();
const { WebSocketServer } = require("ws");

const configureDB = require("./config/db");
const decryptAndValidateData = require("./utils/decryptAndValidateData");
const updateOrCreate = require("./utils/updateOrCreate");

const wsServer = new WebSocketServer({ port: 3001 });
configureDB();

wsServer.on("connection", (socket) => {
    socket.on("message", async (message) => {
        const incomingData = message.toString().split("|");  // spilit incomming data with |
        const time = new Date(new Date());
        try {

            // decrypt and validate incomming stream data and get decryptData and failureReate
            const { decryptData, failureRate } = await decryptAndValidateData(
                incomingData,
                time
            );

            const parseDecryptData = decryptData.map(data => JSON.parse(data));  // parse each object decrypt dat

            // formate date and time without seconds to save in db 
            const formatedDateTime = `${time.getFullYear()}-${(time.getMonth() + 1)}${time.getDate()} ${time.getHours()}:${time.getMinutes()}`;

            await updateOrCreate(formatedDateTime, parseDecryptData); // save decrypted data in db with in interval of one min

            console.log(`${parseDecryptData.length} Data - validate, decrypt and save incomming message in db`);
            console.log(`successRate ${100 - failureRate} %`);  // Print success rate of decrypt and validate of data

        } catch (err) {
            console.log(err);
        }
    });
});

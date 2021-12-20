require("dotenv").config();
const http = require("http");
const server = http.createServer();
const { WebSocketServer } = require("ws");

const configureDB = require("./config/db");
const decryptAndValidateData = require("./utils/decryptAndValidateData");
const updateOrCreate = require("./utils/updateOrCreate");

// noServer option use to share the same server between multiple WebSocket server
const wsServer = new WebSocketServer({ noServer: true }); 
const wsServerFE = new WebSocketServer({ noServer: true });


server.listen(3001);
configureDB();
let frontendSocket = null;  // for frontend app 

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

            await updateOrCreate(formatedDateTime, parseDecryptData); // save decrypted data in db
           
            const successRate = 100 - failureRate;

            // check frontend call and send decrypt data to FE app
            if (frontendSocket) {
                frontendSocket.send(JSON.stringify({
                    successRate: successRate,
                    time: formatedDateTime,
                    data: upsertparseDecryptDataRes
                }));
            }

            console.log(`${parseDecryptData.length} Data - validate, decrypt and save into db`);
            console.log(`successRate ${successRate} %`);  // Print success rate of decrypt and validate of data

        } catch (err) {
            console.log(err);
        }
    });
});

// add socket instance for frontend client
wsServerFE.on("connection", (socket) => {
    frontendSocket = socket;
});

server.on("upgrade", (request, socket, head) => {

    // listen from emitter service
    if (request.url === "/") {  
        wsServer.handleUpgrade(request, socket, head, (socket) => {
            wsServer.emit("connection", socket, request);
        });
        // listen from frontend
    } else if (request.url === "/frontendCall") {  
        wsServerFE.handleUpgrade(request, socket, head, function done(ws) {
            wsServerFE.emit("connection", ws, request);
        });
    } else {
        socket.destroy();
    }
});

require("dotenv").config();
const {WebSocketServer} = require("ws");
  const wsServer = new WebSocketServer({ port: 3001 });

  wsServer.on("connection", (socket) => {
    socket.on("message", async (message) => {
      const messageArray = message.toString().split("|");
      const time = new Date(new Date().toUTCString());
     
      console.log(messageArray, 'recieved decrypted message');
    });
  });

require("dotenv").config();

const ws = require("ws");

const data = require("./data.json");

const getHash =  require("./utils/getHash");
const encryptMessage =  require("./utils/encryptMessage");

const randomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const createMessageStream = () => {
  const randomNumber = randomInteger(49, 499); // get random integer between 49 - 499
  const messageArray = [];
  for (let i = 0; i < randomNumber; i++) {
    const originalMessage = {
      name: data.names[Math.floor(Math.random() * data.names.length)],
      origin: data.names[Math.floor(Math.random() * data.names.length)],
      destination: data.cities[Math.floor(Math.random() * data.cities.length)],
    };

    const sumCheckMessage = {
      ...originalMessage,
      secret_key: getHash(JSON.stringify(originalMessage)), // hash orignial message
    };
     
    const encryptedMsg = encryptMessage(sumCheckMessage);  // encrypted message data
   
    messageArray.push(encryptedMsg);  // push to Array 
  }
    console.log(`${messageArray.length} Data -  encrypted and send`);
  return messageArray.join("|");  // change , by |
};

const client = new ws("ws:localhost:3001");
client.on("open", () => setInterval(() => client.send(createMessageStream()), 10000));

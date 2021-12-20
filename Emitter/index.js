require("dotenv").config();

const crypto = require("crypto");
const ws = require("ws");

const data = require("./data.json");

const randomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function getHash(message) {
  if (message !== undefined) {
      return crypto.createHash('sha256').update(message).digest('hex');
  } else {
      throw new Error('Message is required');
  }

}

const createMessageStream = () => {
  const randomNumber = randomInteger(49, 499);
  const messageArray = [];
  for (var i = 0; i < randomNumber; i++) {
    const originalMessage = {
      name: data.names[Math.floor(Math.random() * data.names.length)],
      origin: data.names[Math.floor(Math.random() * data.names.length)],
      destination: data.cities[Math.floor(Math.random() * data.cities.length)],
    };

    const sumCheckMessage = {
      ...originalMessage,
      secret_key: getHash(JSON.stringify(originalMessage)),
    };

    const iv = process.env.INITIALIZATION_VECTOR;
    const key = process.env.ENCRYPT_DECRYPT_KEY;

    const message = JSON.stringify(sumCheckMessage);

    // make the encrypter function
    const encrypter = crypto.createCipheriv("aes-256-ctr", key, iv);

    // encrypt the message
    let encryptedMsg = encrypter.update(message, "utf8", "hex");
    encryptedMsg += encrypter.final("hex");
    messageArray.push(encryptedMsg);
  }
    console.log(messageArray, 'encrypted message array');
  return messageArray.join("|");
};

const client = new ws("ws:localhost:3001");
client.on("open", () => setInterval(() => client.send(createMessageStream()), 10000));

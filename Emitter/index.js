require("dotenv").config();

const crypto = require("crypto");
const ws = require("ws");

const data = require("./data.json");

const randomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const sharedSecret = process.env.HMAC_HASH_SECRET;
function getHmac(message) {
  const hmac = crypto.createHmac("SHA256", sharedSecret)
    .update(JSON.stringify(message), "utf-8")
    .digest("base64");
  return hmac;
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
    console.log(originalMessage, 'origianl message')

    const sumCheckMessage = {
      ...originalMessage,
      secret_key: getHmac(originalMessage),
    };

    const iv = process.env.INITIALIZATION_VECTOR;
    const key = process.env.ENCRYPT_DECRYPT_KEY;

    const message = JSON.stringify(sumCheckMessage);
    console.log(message, 'sumCheckMessage');

    // make the encrypter function
    const encrypter = crypto.createCipheriv("aes-256-ctr", key, iv);

    // encrypt the message
    let encryptedMsg = encrypter.update(message, "utf8", "hex");
    console.log(encryptedMsg, 'encrypt message');
    messageArray.push(encryptedMsg);
  }
    console.log(messageArray, 'encrypted message array');
  return messageArray.join("|");
};

setInterval(() => {
    console.log(createMessageStream(),'encrypted message stream');
}, 10000);
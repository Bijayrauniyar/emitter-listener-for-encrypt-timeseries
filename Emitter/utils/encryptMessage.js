const encryptMessage = (message) => {
    const iv = process.env.INITIALIZATION_VECTOR;
    const key = process.env.ENCRYPT_DECRYPT_KEY;

    const message = JSON.stringify(message);

    // make the encrypter function
    const encrypter = crypto.createCipheriv("aes-256-ctr", key, iv);

    // encrypt the message
    let encryptedMsg = encrypter.update(message, "utf8", "hex");
    encryptedMsg += encrypter.final("hex");
    return encryptedMsg;
}

module.exports = encryptMessage;
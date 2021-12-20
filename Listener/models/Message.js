const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  timeStamp: { type: String, required: true },
  data: {type : Array},
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;


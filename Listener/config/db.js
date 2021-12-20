const mongoose = require("mongoose");

const configureDB = () => {
  mongoose
    .connect(process.env.MONGODB_URI || process.env.DATABASE_LOCAL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DB connected");
    })
    .catch((err) => {
      console.log("error", err);
    });
};

module.exports = configureDB;

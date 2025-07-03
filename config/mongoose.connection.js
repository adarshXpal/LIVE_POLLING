const mongoose = require("mongoose");
const DB = process.env.MONGODB_URI;

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connected with DataBase");
  }).catch((err) => {
    console.log(err);
  });

module.exports = mongoose.connection;

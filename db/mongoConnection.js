const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((data) => {
    console.log("Connected to MongoDB");
  });

module.exports = mongoose;
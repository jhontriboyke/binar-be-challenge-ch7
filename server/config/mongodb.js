const mongoose = require("mongoose");
require("dotenv").config();

module.exports = {
  connect: () => {
    mongoose
      .connect(process.env.MONGODB_URI_TEST)
      .then(() => {
        console.log(`Connected to MongoDB`);
      })
      .catch((err) => {
        console.log(`Error occured while connect to MongoDB: ${err.message}`);
      });
  },
};

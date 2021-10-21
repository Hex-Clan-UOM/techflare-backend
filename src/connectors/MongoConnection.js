const mongoose = require("mongoose");

// connect to mongodb
const connectMongo = (connectionURI) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(connectionURI, {}, (error) => {
      if (error) {
        reject(error);
      }
      resolve("connected to database");
    });
  });
};

module.exports = connectMongo;

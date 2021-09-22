const mongoose = require("mongoose");
const appConfig = require("../../appConfig");
const logger = require("../commons/logger");

// connect to mongodb
const connectMongo = ()=>{
    mongoose.connect(appConfig.mongoDB, {}, (error) => {
    if (error) {
        logger.error('unable to connect to the database! ' + error.message);
        return;
    }

    logger.info("connected to database");
});
}

module.exports = connectMongo


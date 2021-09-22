const mongoose = require("mongoose");
const appConfig = require('./appConfig');
const logger = require("./commons/logger");

// connect to mongodb
mongoose.connect(appConfig.mongoDB, {}, (error) => {
    if (error) {
        logger.error('unable to connect to the database! ' + error.message);
        return;
    }

    logger.info("connected to database");
});

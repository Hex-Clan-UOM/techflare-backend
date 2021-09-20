const mongoose = require("mongoose");
const logger = require("./logger/customLogger");

// connect to mongodb
mongoose.connect(process.env.MONGODB_URI, {}, (error) => {
    if (error) {
        logger.error('unable to connect to the database! ' + error.message);
        return;
    }

    logger.info("connected to database");
});

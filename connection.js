const mongoose = require("mongoose");
const logger = require("./logger");

// connect to mongodb
mongoose.connect(process.env.MONGODB_URI, {}, (error) => {
    if (error) {
        logger.error(`unable to connect to the database!!",${error}`);
        return;
    }

    logger.info("connected to database");
});

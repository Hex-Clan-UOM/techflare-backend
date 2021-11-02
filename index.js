require("dotenv").config();
const logger = require("./src/commons/logger");
const app = require("./app")();
const config = require("./config");
const port = config.port || 8080;
const connectMongo = require("./src/connectors");
const { createSuperUser } = require("./src/services").userService;
connectMongo(config.mongoDB)
  .then((res) => {
    logger.info(res);
    return config.superUsers.forEach((superUser) => {
      createSuperUser(superUser.googleId, superUser.email)
        .then((result) => {
          logger.info(
            "super admin with User ID: " + result._id + " created successfully"
          );
        })
        .catch((e) => {
          logger.error(
            "unable to create super user with google ID: " +
              superUser.googleId +
              ": " +
              e.message
          );
        });
    });
  })
  .catch((err) => {
    logger.error("unable to connect to mongo DB: " + err.message);
  });

app.listen(port, () => {
  logger.info("App is running on port: " + port);
});

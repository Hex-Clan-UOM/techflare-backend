require("dotenv").config();
const logger = require('./src/commons/logger');
const app = require("./app")();
const appConfig = require("./appConfig");
const port = appConfig.port || 8080;
const connectMongo = require("./src/connectors");
connectMongo(appConfig.mongoDB).then((res) => {
  logger.info(res);
}).catch((err) => {
  logger.error('unable to connect to mongo DB: ' + err.message);
})

app.listen(port, () => {
  logger.info("App is running on port: " + port);
});

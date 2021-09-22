require("dotenv").config();
const appConfig = require('./appConfig');
const express = require("express");
const app = express();
const connectMongo = require("./connectors");
const logger = require('./commons/logger');

const port = appConfig.port || 8080;

connectMongo();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json("Hello from Hex Clan");
});

app.listen(port, () => {
  logger.info("App is running on port: " + port);
});

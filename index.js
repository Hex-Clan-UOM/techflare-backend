require("dotenv").config();
const appConfig = require("./appConfig");
const express = require("express");
const app = express();
const connectMongo = require("./src/connectors");
const logger = require("./src/commons/logger");
const port = appConfig.port || 8080;

connectMongo();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { userController } = require("./src/controllers");
app.use("/user", userController);

app.get("/", async (req, res) => {
  res.json("hello");
});

app.listen(port, () => {
  logger.info("App is running on port: " + port);
});

require("dotenv").config();
const appConfig = require("./appConfig");
const express = require("express");
const app = express();
const session = require("express-session");
const connectMongo = require("./src/connectors");
const logger = require("./src/commons/logger");
const port = appConfig.port || 8080;
const cors = require("cors");

connectMongo();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

// session middleware
app.use(
  session({
    secret: appConfig.sessionSecret,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

const controllers = require("./src/controllers");
for (controller in controllers) {
  app.use(controllers[controller]);
}

// default route handler
app.all("*", async (req, res, next) => {
  try {
    return res.status(404).send({ success: false, message: "data not found" });
  } catch (e) {
    res.status(501).send({
      success: false,
      message: "some think went wrong, try again later",
    });
  }
});

// Error handling function
app.use((err, req, res, next) => {
  res.status(500).send({ success: false, message: err.message });
  return;
});

app.listen(port, () => {
  logger.info("App is running on port: " + port);
});

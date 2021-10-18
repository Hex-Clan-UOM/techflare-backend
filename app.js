const appConfig = require("./appConfig");
const express = require("express");
const app = express();
const cors = require("cors");

const createApp = () => {
  const corsOptions = {
    origin: appConfig.frontEnd,
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  };

  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const controllers = require("./src/controllers");
  for (controller in controllers) {
    app.use(controllers[controller]);
  }

  // const lorumRouter = require('./play_ground/lorumIpsum')
  // app.use(lorumRouter);

  // default route handler
  app.all("*", async (req, res, next) => {
    try {
      return res
        .status(404)
        .send({ success: false, message: "data not found" });
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

  return app;
};
module.exports = createApp;

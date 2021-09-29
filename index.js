require("dotenv").config();
import { port as _port, sessionSecret } from "./appConfig";
import express, { json, urlencoded } from "express";
const app = express();
import session from "express-session";
import connectMongo from "./src/connectors";
import { info } from "./src/commons/logger";
const port = _port || 8080;

connectMongo();

app.use(json());
app.use(urlencoded({ extended: true }));

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

// session middleware
app.use(
  session({
    secret: sessionSecret,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

import controllers from "./src/controllers";
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

//How do we start listening to the server
app.listen(port, () => {
  info("App is running on port: " + port);
});

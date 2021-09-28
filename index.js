require("dotenv").config();
const express = require("express");
const app = express();
require("./connection");
const logger = require("./logger");

const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.get("/", (req, res) => {
  res.json("Hello from Hex Clan");
});

//How do we start listening to the server
app.listen(port, () => {
  logger.info("App is running on port: " + port);
});

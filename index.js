require("dotenv").config();
const express = require("express");
const app = express();
require("./connection");
const logger = require("./logger");

const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json("Hello from Hex Clan");
});

app.listen(port, () => {
  logger.info("App is running on port: " + port);
});

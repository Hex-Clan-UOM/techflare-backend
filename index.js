require("dotenv").config();
const express = require("express");
const app = express();
require("./connection");

const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.json("Hello from Hex Clan");
});

app.listen(port, () => {
  console.log("App is running on port: " + port);
});

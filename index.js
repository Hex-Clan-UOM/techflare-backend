const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json("Hello from Hex Clan");
});

app.listen("8080", () => {
  console.log("running on port 8080");
});

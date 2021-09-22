const express = require("express");
const router = express.Router();
const { createUser } = require("../services");

router.get("/", async (req, res) => {
  const user = await createUser("thushi", "e@mail.com", "pic12");
  res.json(user);
});

module.exports = router;

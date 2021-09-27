const express = require("express");
const router = express.Router();
const { createUser, signInUser } = require("../services");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

router.get("/", async (req, res) => {
  const user = await createUser("thushi", "e@mail.com", "pic12");
  res.json(user);
});

router.post("/", async (req, res) => {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  const { name, email, picture } = ticket.getPayload();
  const user = await signInUser(name, email, picture);
  res.json(user);
});

module.exports = router;

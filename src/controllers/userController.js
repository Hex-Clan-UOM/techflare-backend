const express = require("express");
const router = express.Router();
const { logInWithGoogle, getUserById } = require("../services").userService;
const logger = require("../commons/logger");

router.post("/login", async (req, res) => {
  try {
    const user = await logInWithGoogle(req.body.idToken, req.session);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "unable to login in to the system, try again later",
      });
    }
    logger.info(user.firstName + " " + user.lastName + " logged in");
    res.send({
      succees: true,
      user,
      message: "you have logged in successfully",
    });
  } catch (e) {
    res.status(501).send({
      success: false,
      message: "unable to login in to the system, try again later",
      error: e.message,
    });
  }
});

module.exports = router;

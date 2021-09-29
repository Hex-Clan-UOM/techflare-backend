const express = require("express");
const router = express.Router();
const { logInWithGoogle, getUserById } = require("../services").userService;
const logger = require("../commons/logger");
const { isAutherized } = require("../express-middleware");

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

router.get("/user", isAutherized, async (req, res) => {
  try {
    const user = await getUserById(req.userid);
    if (!user) {
      res.status(404).send({ succees: false, message: "data not found" });
      return;
    }
    res.send(user);
  } catch (e) {
    res
      .status(501)
      .send({ success: false, message: "some thing wrong try again later" });
  }
});
module.exports = router;
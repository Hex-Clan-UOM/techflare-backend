const express = require("express");
const router = express.Router();
const { logInWithGoogle, getUserByGoogleId } =
  require("../services").userService;
const logger = require("../commons/logger");

router.get("/login", async (req, res) => {
  try {
    const user = await logInWithGoogle(process.env.TEMP_ID_TOKEN, req.session);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "unable to login in to the system, try again later",
      });
    }

    res.send({
      succees: true,
      user,
      message: "you have logged in successfully",
    });
  } catch (e) {
    res.status(501).send({
      success: false,
      message: "unable to login in to the system, try again later",
    });
  }
});

router.get("/user", async (req, res) => {
  try {
    const user = await getUserByGoogleId(req.session.userid);
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

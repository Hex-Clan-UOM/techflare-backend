const jwt = require("jsonwebtoken");
const appConfig = require("../../appConfig");
const isAutherized = async (req, res, next) => {
  try {
    const accessToken = req.header("Authorization").replace("Bearer ", "");
    const payload = jwt.verify(accessToken, appConfig.accessTokenSecret);

    if (!payload) {
      throw new Error("please login again");
    }

    req.accessToken = accessToken;
    req.userid = payload.userid;
    next();
  } catch (e) {
    res.status(401).send({ success: false, message: "access denied: " + e });
  }
};

module.exports = { isAutherized };

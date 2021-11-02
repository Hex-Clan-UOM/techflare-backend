const jwt = require("jsonwebtoken");
const appConfig = require("../../config");
const isAutherized = async (req, res, next) => {
  try {
    const accessToken = req.header("Authorization").replace("Bearer ", "");
    const payload = jwt.verify(accessToken, appConfig.accessTokenSecret);
    if (!payload) {
      throw new Error("please login again");
    }

    req.accessToken = accessToken;
    req.userid = payload.userid;
    req.role = payload.role;
    next();
  } catch (e) {
    res.status(401).send({ success: false, message: "access denied: " + e });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    if (req.role !== "admin") {
      throw new Error("please login as admin");
    }
    next();
  } catch (e) {
    res.status(401).send({ success: false, message: "access denied: " + e });
  }
};

const isSuperAdmin = async (req, res, next) => {
  try {
    if (req.role !== "super-admin") {
      throw new Error("please login as admin");
    }
    next();
  } catch (e) {
    res.status(401).send({ success: false, message: "access denied: " + e });
  }
};

module.exports = { isAutherized, isAdmin, isSuperAdmin };

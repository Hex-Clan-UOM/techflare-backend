const jwt = require("jsonwebtoken");
const appConfig = require("../../appConfig");
const isAutherized = async (req, res, next) => {
  try {
    const accessToken = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(accessToken, appConfig.accessTokenSecret);
    const session = req.session;
    if (accessToken === session.accessToken && decoded.sessionid === session.id) {
      req.accessToken = accessToken;
      req.userid = req.session.userid;
      next()
    }

    throw new Error('please login again')
  } catch (e) {
    res
      .status(401)
      .send({ success: false, message: 'access denied: ' + e });
  }
};

module.exports = {isAutherized};

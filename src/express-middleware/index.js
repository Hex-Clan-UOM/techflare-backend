const jwt = require("jsonwebtoken");
const appConfig = require("../../appConfig");
const isAutherized = async (req, res, next) => {
  try {
    const session = req.session;
    const accessToken = req.header("Authorization").replace('Bearer ', '');
    const decodedFromClient = jwt.verify(accessToken, appConfig.accessTokenSecret);
    const decodedFromSession = jwt.verify(session.accessToken, appConfig.accessTokenSecret);
    if (decodedFromClient.userid !== decodedFromSession.userid || decodedFromClient.sessionid !== decodedFromSession.sessionid) {
      throw new Error('please login again')
    }

    req.accessToken = accessToken;
      req.userid = decodedFromSession.userid;
      next()
  } catch (e) {
    res
      .status(401)
      .send({ success: false, message: 'access denied: ' + e });
  }
};

module.exports = {isAutherized};

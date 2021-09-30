const jwt = require("jsonwebtoken");
const appConfig = require("../../appConfig");
const isAutherized = async (req, res, next) => {
  try {
    const session = req.session;
    const accessToken = req.header("Authorization").replace("Bearer ", "");
    const decodedFromClient = jwt.verify(
      accessToken,
      appConfig.accessTokenSecret
    );
    const decodedFromSession = jwt.verify(
      session.accessToken,
      appConfig.accessTokenSecret
    );
    // console.log('current sessionid:' + session.id + ', client sessionid:' + decodedFromClient.sessionid + ", server sessionid: " + decodedFromSession.sessionid);
    // console.log('client userid:' + decodedFromClient.userid + ", server userid: " + decodedFromSession.userid)
    if (
      decodedFromClient.userid !== decodedFromSession.userid ||
      decodedFromClient.sessionid !== decodedFromSession.sessionid
    ) {
      throw new Error("please login again");
    }

    req.accessToken = accessToken;
    req.userid = decodedFromSession.userid;
    next();
  } catch (e) {
    res.status(401).send({ success: false, message: "access denied: " + e });
  }
};

module.exports = { isAutherized };

const appConfig = require("../../appConfig");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const client = new OAuth2Client(appConfig.googleClientId);
const { User } = require("../schemas/index");
const { UserClass } = require("../daos");

const verify = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: appConfig.googleClientId, // Specify the CLIENT_ID of the app that accesses the backend
  });

  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error('id token is invalid');
  }
  return payload;
};

const getUserByGoogleId = async (googleId) => {
  const user = await User.findOne({ googleId });
  if (!user) {
    return null;
  }

  return user;
};

const createUser = async ({ given_name, family_name, sub, email, picture }) => {
  const user = new UserClass(given_name, family_name, sub, email, picture);
  await new User(user).save();
  return user;
};

const logInWithGoogle = async(idToken, session) => {
  //varify token
  const payload = await verify(idToken);

  //create user if not exist
  let user = await getUserByGoogleId(payload.sub);
  if(!user) {
    user = await createUser(payload)
  }

  // add jwt to session
  const newAccessTokenPayload = {sessionid: session.id, userid: user._id, googleid:user.googleId};
  const accessToken = jwt.sign(newAccessTokenPayload, appConfig.accessTokenSecret);
  session.accessToken = accessToken;
  const userObj = user.toObject();
  return {...userObj, accessToken};
};

const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    return null;
  }

  return user;
};

module.exports = { logInWithGoogle, getUserById };

const appConfig = require("../../appConfig");
const { OAuth2Client } = require("google-auth-library");
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
    return null;
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

const logInWithGoogle = async (idToken, session) => {
  //varify token
  //check user is already exist in database
  //if exist => establish a session
  //if not =>
  //create new user
  //establish session

  const payload = await verify(idToken);
  if (!payload) {
    throw new Error("invalid token");
  }

  const user = await getUserByGoogleId(payload.sub);
  if (!user) {
    user = await createUser(payload);
  }
  session.userid = user.googleId;
  return user;
};

module.exports = { logInWithGoogle, getUserByGoogleId };

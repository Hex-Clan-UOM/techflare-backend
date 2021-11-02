const appConfig = require("../../config");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const client = new OAuth2Client(appConfig.googleClientId);
const { User } = require("../schemas").User;
const { createUserDao } = require("../daos");

const verify = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: appConfig.googleClientId, // Specify the CLIENT_ID of the app that accesses the backend
  });
  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error("id token is invalid");
  }
  return payload;
};

const createUser = async ({ given_name, family_name, sub, email, picture }) => {
  const userDao = createUserDao(given_name, family_name, sub, email, picture);
  const user = new User(userDao);
  await user.save();
  return user;
};

const logInWithGoogle = async (idToken) => {
  //varify token
  const payload = await verify(idToken);

  //update/create user
  let user = await User.findOneAndUpdate(
    { googleId: payload.sub },
    {
      firstName: payload.given_name,
      lastName: payload.family_name,
      googleId: payload.sub,
      email: payload.email,
      avatar: payload.picture
    },
    { upsert: true, returnDocument: "after" }
  );

  // generate jwt
  const newAccessTokenPayload = {
    userid: user._id,
    googleid: user.googleId,
    role: user.role,
  };

  const accessToken = jwt.sign(
    newAccessTokenPayload,
    appConfig.accessTokenSecret
  );
  const userObj = user.toObject();
  return { ...userObj, accessToken };
};

const getUserById = async (userid) => {
  const user = await User.findById(userid);
  return user;
};

const findUserFromToken = async (accessToken) => {
  const decoded = await jwt.decode(accessToken);
  return decoded.userid;
};

const createSuperUser = async (googleId, email) => {
  const existingUser = await User.findOne({ googleId });
  if (!existingUser) {
    const user = createUserDao(
      "Not set",
      "Not set",
      googleId,
      email,
      "Not set",
      undefined,
      "super-admin"
    );
    const newSuperAdmin = new User(user);
    await newSuperAdmin.save();
    return newSuperAdmin;
  }
  existingUser.role = "super-admin";
  await existingUser.save();
  return existingUser;
};

const changeUserRole = async (userid, role) => {
  const updatedUser = await User.findByIdAndUpdate(userid, {role}, {returnDocument: 'after', runValidators: true});
  return updatedUser;
}

module.exports = {
  logInWithGoogle,
  getUserById,
  findUserFromToken,
  client,
  createUser,
  createSuperUser,
  changeUserRole
};

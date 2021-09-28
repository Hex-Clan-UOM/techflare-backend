const appConfig = require("../../appConfig");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const client = new OAuth2Client(appConfig.googleClientId);
const { User } = require("../schemas/index");
const { newUser } = require("../daos");

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
  const user = newUser(given_name, family_name, sub, email, picture);
  const newUserToCreate = new User(user);
  await newUserToCreate.save();
  return newUserToCreate;
};

const logInWithGoogle = (idToken, session) => {
  //varify token
  //check user is already exist in database
  //if exist => establish a session, create a jwt token, signed, store inside the session
  //if not =>
  //create new user
  //establish session
  return new Promise((resolve, reject) => {
    return session.regenerate((err) => {
      if (err) {
        reject(new Error("error on regenerating session"));
      }
      verify(idToken)
        .then((payload) => {
          if (!payload) {
            reject(new Error("invalid token"));
          }

          getUserByGoogleId(payload.sub)
            .then((user) => {
              //user not found
              if (!user) {
                createUser(payload)
                  .then((user) => {
                    session.accessToken = jwt.sign(
                      {
                        sessionid: session.id,
                        googleid: payload.sub,
                        userid: user._id,
                      },
                      appConfig.accessTokenSecret
                    );
                    session.userid = user._id;
                    const userObj = user.toObject();
                    resolve({ ...userObj, accessToken: session.accessToken });
                  })
                  .catch((e) => {
                    reject(e);
                  });
              }

              // user  found
              session.accessToken = jwt.sign(
                {
                  sessionid: session.id,
                  googleid: payload.sub,
                  userid: user._id,
                },
                appConfig.accessTokenSecret
              );
              session.userid = user._id;
              const userObj = user.toObject();
              resolve({ ...userObj, accessToken: session.accessToken });
            })
            .catch((e) => {
              reject(e);
            });
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
};

module.exports = { logInWithGoogle };

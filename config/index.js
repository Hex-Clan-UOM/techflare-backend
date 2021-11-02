module.exports = {
  environment: process.env.NODE_ENV,
  port: process.env.PORT,
  mongoDB: process.env.MONGO_DB,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  sessionSecret: process.env.SECRET,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  frontEnd: process.env.FRONTEND_URI,
  superUsers: [
    {
      googleId: "118394798226339311512",
      email: "theepichris@gmail.com",
    },
    {
      googleId: "108497484914902852096",
      email: "manothushitha@gmail.com",
    },
  ],
};

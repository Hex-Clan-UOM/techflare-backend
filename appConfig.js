module.exports = {
  environment: process.env.NODE_ENV,
  port: process.env.PORT,
  mongoDB: process.env.MONGO_DB,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  sessionSecret: process.env.SECRET,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET
};

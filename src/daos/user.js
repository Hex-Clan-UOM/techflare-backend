const createUserDao = (
  firstName,
  lastName,
  googleId,
  email,
  avatar,
  createdAt = new Date()
) => {
  return {
    firstName,
    lastName,
    googleId,
    email,
    avatar,
    createdAt,
  };
};

module.exports = createUserDao;

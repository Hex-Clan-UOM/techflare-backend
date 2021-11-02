const createUserDao = (
  firstName,
  lastName,
  googleId,
  email,
  avatar,
  createdAt = new Date(),
  role = "user"
) => {
  return {
    firstName,
    lastName,
    googleId,
    email,
    avatar,
    createdAt,
    role,
  };
};

module.exports = createUserDao;

const { User } = require("../schemas");

const newUser = async (name, email, picture) => {
  const user = await User.create({
    name,
    email,
    picture,
  });
  return user;
};

const findUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

module.exports = { newUser, findUserByEmail };

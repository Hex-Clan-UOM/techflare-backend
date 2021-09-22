const { User } = require("../schemas");

const newUser = async (name, email, picture) => {
  const user = await User.create({
    name,
    email,
    picture,
  });
  return user;
};

module.exports = { newUser };

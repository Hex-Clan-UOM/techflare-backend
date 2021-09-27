const { newUser, findUserByEmail } = require("../daos");

const createUser = async (name, email, picture) => {
  try {
    const user = await newUser(name, email, picture);
    return user;
  } catch (error) {
    console.log(error);
  }
};

const signInUser = async (name, email, picture) => {
  try {
    const user = findUserByEmail(email);
    if (user) {
      return user;
    } else {
      user = await newUser(name, email, picture);
      return user;
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createUser, signInUser };

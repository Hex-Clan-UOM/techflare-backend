const { newUser } = require("../daos");

const createUser = async (name, email, picture) => {
  try {
    const user = await newUser(name, email, picture);
    return user;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createUser };

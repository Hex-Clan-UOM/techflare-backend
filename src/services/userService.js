const { newUser, findUserByEmail } = require("../daos");
const jwt = require("jsonwebtoken");

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
    let user = findUserByEmail(email);
    if (!user) {
      user = await newUser(name, email, picture);
    }
    user.token = jwt.sign(user._id, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    return user;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createUser, signInUser };

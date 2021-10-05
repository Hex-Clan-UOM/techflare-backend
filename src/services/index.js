const userService = require("./userService");
const { findUserFromToken } = require("./userService");
const { findPostById, findAllPosts, createPost } = require("./postService");

module.exports = {
  userService,
  findPostById,
  findAllPosts,
  createPost,
  findUserFromToken,
};

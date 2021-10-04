const userService = require("./userService");
const { findPostById, findAllPosts } = require("./postService");

module.exports = { userService, findPostById, findAllPosts };

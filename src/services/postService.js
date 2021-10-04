const { Post } = require("../schemas/index");

const findPostById = async (postId) => {
  const post = await Post.findById(postId);
  return post;
};

const findAllPosts = async () => {
  const posts = await Post.find({});
  return posts;
};

module.exports = { findPostById, findAllPosts };

const { createPostDao } = require("../daos");
const { Post } = require("../schemas/index");

const findPostById = async (postId) => {
  const post = await Post.findById(postId);
  return post;
};

const findAllPosts = async () => {
  const posts = await Post.find({});
  return posts;
};

const createPost = async (author, title, body) => {
  const postDao = createPostDao(author, title, body);
  const post = new Post(postDao);
  await post.save();
  return post;
};

module.exports = { findPostById, findAllPosts, createPost };

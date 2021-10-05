const { createPostDao } = require("../daos");
const { Post } = require("../schemas/index");

const findPostById = async (postId) => {
  const post = await Post.findById(postId).populate(
    "author",
    "firstName lastName avatar"
  );
  return post;
};

const findAllPosts = async () => {
  const posts = await Post.find({}).populate(
    "author",
    "firstName lastName avatar"
  );
  return posts;
};

const createPost = async (author, title, body) => {
  const postDao = createPostDao(author, title, body);
  const post = new Post(postDao);
  await post.save();
  const newPost = await Post.findById(post._id).populate(
    "author",
    "firstName lastName avatar"
  );
  return newPost;
};

module.exports = { findPostById, findAllPosts, createPost };

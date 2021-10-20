const { createPostDao } = require("../daos");
const { Post } = require("../schemas/index");

const findPostById = async (postId) => {
  const post = await Post.findById(postId).populate(
    "author",
    "firstName lastName avatar"
  );
  return post;
};

const findAllPosts = async (skip, limit) => {
  const skipVal = parseInt(skip, 10);
  const limitVal = parseInt(limit, 10);
  const skipInt = isNaN(skipVal) || skipVal < 0 ? 0 : skipVal;
  const limitInt = isNaN(limitVal) || limitVal < 0 ? 10 : limitVal;
  const number = await Post.countDocuments();

  const posts = await Post.find({})
    .sort({
      createdAt: -1,
    })
    .populate("author", "firstName lastName avatar")
    .skip(skipInt)
    .limit(limitInt);
  return { posts, number };
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

const updatePost = async (postid, title, body) => {
  const updatedPost = await Post.findByIdAndUpdate(
    { _id: postid },
    { title, body }
  );
  const post = await findPostById(postid);
  return post;
};

const deletePost = async (postId) => {
  const post = await Post.findByIdAndDelete(postId);
  return post;
};

const searchPosts = async (searchString, skip, limit, strict) => {
  const skipVal = parseInt(skip, 10);
  const limitVal = parseInt(limit, 10);
  const skipInt = isNaN(skipVal) || skipVal < 0 ? 0 : skipVal;
  const limitInt = isNaN(limitVal) || limitVal < 0 ? 10 : limitVal;
  let search = !searchString ? "" : searchString;
  if (strict) {
    search = '"' + search + '"';
  }
  return await Post.find({ $text: { $search: search } })
    .sort({
      createdAt: -1,
    })
    .populate("author", "firstName lastName avatar")
    .skip(skipInt)
    .limit(limitInt);
};

module.exports = {
  findPostById,
  findAllPosts,
  createPost,
  updatePost,
  searchPosts,
  deletePost,
};

const { createPostDao } = require("../daos");
const { Post } = require("../schemas/index").Post;
const findPostById = async (postId) => {
  const post = await Post.findById(postId)
    .populate({ path: "author", select: "firstName lastName avatar" })
    .populate({ path: "likes", select: "firstName lastName avatar" })
    .populate({
      path: "comments",
      populate: {
        path: "author",
        select: "firstName lastName avatar",
      },
    })
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
    .populate({ path: "author", select: "firstName lastName avatar" })
    .populate({ path: "likes", select: "firstName lastName avatar" })
    .populate({
      path: "comments",
      populate: {
        path: "author",
        select: "firstName lastName avatar",
      }
    })
    .skip(skipInt)
    .limit(limitInt);
  return { posts, number };
};

const createPost = async (author, title, body, ...images) => {
  const postDao = createPostDao(author, title, body, undefined, ...images);
  const post = new Post(postDao);
  await post.save();
  const newPost = await Post.findById(post._id).populate({
    path: "author",
    select: "firstName lastName avatar",
  });
  return newPost;
};

const updatePost = async (postid, userid, title, body, ...images) => {
  return await Post.findOneAndUpdate(
    { _id: postid, author: userid },
    { title, body, images},
    { returnDocument: "after" }
  );
};

const deletePost = async (postId, userid) => {
  const post = await Post.findOneAndDelete({ _id: postId, author: userid});
  return post;
};

const searchPosts = async (searchString, skip, limit, strict) => {
  const skipVal = parseInt(skip, 10);
  const limitVal = parseInt(limit, 10);
  const skipInt = isNaN(skipVal) || skipVal < 0 ? 0 : skipVal;
  const limitInt = isNaN(limitVal) || limitVal < 0 ? 10 : limitVal;
  let search = !searchString ? "" : searchString;
  if (strict) {
    search = `\"${search}\"`;
  }
  return await Post.find({ $text: { $search: search } })
    .sort({
      createdAt: -1,
    })
    .populate({ path: "author", select: "firstName lastName avatar" })
    .populate({ path: "likes", select: "firstName lastName avatar" })
    .populate({
      path: "comments",
      populate: {
        path: "author",
        select: "firstName lastName avatar"
      }
    })
    .skip(skipInt)
    .limit(limitInt);
};

const likePost = async (postId, userId) => {
  return await Post.findByIdAndUpdate(
    postId,
    { $addToSet: { likes: userId } },
    { returnDocument: "after" }
  );
};

const unlikePost = async (postId, userId) => {
  return await Post.findByIdAndUpdate(
    postId,
    { $pull: { likes: userId } },
    { returnDocument: "after" }
  );
};

module.exports = {
  findPostById,
  findAllPosts,
  createPost,
  updatePost,
  searchPosts,
  deletePost,
  likePost,
  unlikePost,
};

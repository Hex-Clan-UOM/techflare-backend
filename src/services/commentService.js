const { createCommentDao } = require("../daos");
const { Comment } = require("../schemas/index");

const findCommentsByPost = async (postId) => {
  const comments = await Comment.find({ post: postId }).populate(
    "author",
    "firstName lastName avatar"
  );
  return comments;
};

const findCommentById = async (commentId) => {
  const comment = await Comment.findById(commentId);
  return comment;
};

const createComment = async (author, post, title, body) => {
  const commentDao = createCommentDao(author, post, title, body);
  const comment = new Comment(commentDao);
  await comment.save();
  const newComment = await Comment.findById(comment._id).populate(
    "author",
    "firstName lastName avatar"
  );
  return newComment;
};

const deleteComment = async (commentId) => {
  const comment = await Comment.findByIdAndDelete(commentId);
  return comment;
};

module.exports = {
  findCommentsByPost,
  createComment,
  deleteComment,
  findCommentById,
};

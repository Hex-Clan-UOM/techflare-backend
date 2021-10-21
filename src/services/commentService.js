const { createCommentDao } = require("../daos");
const { Comment } = require("../schemas/index").Comment;

const findCommentsByPost = async (postId) => {
  const comments = await Comment.find({ post: postId })
    .sort({
      createdAt: -1,
    })
    .populate("author", "firstName lastName avatar");
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

const updateComment = async (commentId, userid, body) => {
  return await Comment.findOneAndUpdate(
    { _id: commentId, author: userid },
    { body },
    {
      returnDocument: "after",
    }
  );
};

const deleteComment = async (commentId, userid) => {
  return await Comment.findOneAndDelete({ _id: commentId, author: userid });
};

module.exports = {
  findCommentsByPost,
  createComment,
  deleteComment,
  findCommentById,
  updateComment,
};

const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Post",
    },
    body: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { versionKey: false }
);

const Comment = mongoose.model("Comment", commentSchema);
const registerComment = (connection) => {
  return connection.model('Commect', commentSchema);
}

module.exports = {Comment, registerComment };

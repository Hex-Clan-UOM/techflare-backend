const mongoose = require("mongoose");
const momont = require('moment');

const commentSchema = new mongoose.Schema(
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
      get: (v) => momont(v).fromNow()
    },
  },
  { versionKey: false, toJSON: {getters: true} }
);

const Comment = mongoose.model("Comment", commentSchema);
const registerComment = (connection) => {
  return connection.model('Commect', commentSchema);
}

module.exports = { Comment, registerComment };

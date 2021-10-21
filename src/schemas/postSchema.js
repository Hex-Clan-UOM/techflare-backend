const mongoose = require("mongoose");
const moment = require("moment");

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { versionKey: false, toJSON: { virtuals: true } }
);

postSchema.index({ title: "text", body: "text" });
postSchema.virtual("created").get(function (value, virtual, doc) {
  return moment(this.createdAt).fromNow();
});

const Post = mongoose.model("Post", postSchema);
const registerPost = (connection) => {
  return connection.model("Post", postSchema);
};

module.exports = { Post, registerPost, postSchema };

const mongoose = require("mongoose");
const moment = require("moment");
const { Comment } = require("./commentSchema");

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
    images: [
      {
        type: String,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.index({ title: "text", body: "text" });
postSchema.virtual("created").get(function (value, virtual, doc) {
  return moment(this.createdAt).fromNow();
});

postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
});

postSchema.pre("findOneAndDelete", async function () {
  const post = await Post.findOne(this.getFilter()).populate({
    path: "comments",
  });
  if (post && post.comments.length > 0) {
    post.comments.map((comment) => {
      Comment.findByIdAndDelete(comment._id).exec();
    });
  }
});

const Post = mongoose.model("Post", postSchema);
const registerPost = (connection) => {
  return connection.model("Post", postSchema);
};

module.exports = { Post, registerPost, postSchema };

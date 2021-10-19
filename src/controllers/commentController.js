const express = require("express");
const router = express.Router();
const { isAutherized } = require("../express-middleware");
const logger = require("../commons/logger");
const { findUserFromToken } = require("../services/").userService;
const { findCommentsByPost, createComment } =
  require("../services").commentService;
const {
  deleteComment,
  findCommentById,
} = require("../services/commentService");

router.get("/comments/:id", isAutherized, async (req, res) => {
  try {
    const comments = await findCommentsByPost(req.params.id);
    res.status(200).json(comments);
  } catch (e) {
    res.json(e.message);
  }
});

router.post("/comment", isAutherized, async (req, res) => {
  const author = await findUserFromToken(
    req.header("Authorization").replace("Bearer ", "")
  );
  const { post, body } = req.body;
  try {
    const comment = await createComment(req.userid, post, body);
    res.json(comment);
  } catch (e) {
    res.send(e.message);
  }
});

router.delete("/comment/:id", isAutherized, async (req, res) => {
  try {
    const comment = await findCommentById(req.params.id);
    if (req.userid === comment.author.toString()) {
      const deletedComment = await deleteComment(req.params.id);
      res.json(deletedComment);
    } else {
      res.json("cannot delete");
    }
  } catch (e) {
    res.send(e.message);
  }
});

module.exports = router;

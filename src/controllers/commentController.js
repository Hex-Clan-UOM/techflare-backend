const express = require("express");
const router = express.Router();
const { isAutherized } = require("../express-middleware");
const { findCommentsByPost, createComment } =
  require("../services").commentService;
const {
  deleteComment,
  updateComment,
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
  const { post, body } = req.body;
  try {
    const comment = await createComment(req.userid, post, body);
    res.json(comment);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.put("/comment/:id", isAutherized, async (req, res) => {
  try {
    const { body } = req.body;
    const comment = await updateComment(req.params.id, req.userid, body);
    if (!comment) {
      return res.status(400).json("cannot update");
    }
    res.json(comment);
  } catch (e) {
    res.send(e.message);
  }
});

router.delete("/comment/:id", isAutherized, async (req, res) => {
  try {
    const deletedComment = await deleteComment(req.params.id, req.userid);
    if (!deletedComment) {
      res.status(400).json("cannot delete");
    }
    res.json(deletedComment);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

module.exports = router;

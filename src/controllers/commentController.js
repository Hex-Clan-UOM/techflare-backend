const express = require("express");
const router = express.Router();
const { isAutherized } = require("../express-middleware");
const logger = require("../commons/logger");
const { findUserFromToken } = require("../services/").userService;
const { findCommentsByPost, createComment } =
  require("../services").commentService;

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

// router.delete("/post/:id", isAutherized, async (req, res) => {
//   try {
//     const deletedPost = await deletePost(req.params.id);
//     res.json(deletedPost);
//   } catch (e) {
//     res.send(e.message);
//   }
// });

module.exports = router;

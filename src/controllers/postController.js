const express = require("express");
const router = express.Router();
const {
  findAllPosts,
  findPostById,
  createPost,
  findUserFromToken,
} = require("../services");
const { isAutherized } = require("../express-middleware");
const jwt = require("jsonwebtoken");

router.get("/posts", isAutherized, async (req, res) => {
  try {
    const posts = await findAllPosts();
    res.status(200).json(posts);
  } catch (e) {
    res.json(e.message);
  }
});

router.get("/posts/:id", isAutherized, async (req, res) => {
  try {
    const post = await findPostById(req.params.id);
    res.status(200).json(post);
  } catch (e) {
    res.json(e.message);
  }
});

router.post("/post", isAutherized, async (req, res) => {
  const author = await findUserFromToken(
    req.header("Authorization").replace("Bearer ", "")
  );
  const { title, body } = req.body;
  try {
    const post = await createPost(author, title, body);
    res.json(post);
  } catch (e) {
    res.send(e.message);
  }
});

module.exports = router;

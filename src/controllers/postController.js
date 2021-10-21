const express = require("express");
const router = express.Router();
const { isAutherized } = require("../express-middleware");
const logger = require("../commons/logger");
const { findUserFromToken } = require("../services/").userService;
const { findAllPosts, findPostById, createPost, searchPosts, deletePost } =
  require("../services").postService;

router.get("/posts/search", isAutherized, async (req, res) => {
  try {
    const { value, skip, limit, strict } = { ...req.query };
    const searchResult = await searchPosts(value, skip, limit, strict);
    if (!searchResult || searchResult.length < 1) {
      return res.send({
        success: false,
        posts: [],
        message: "search result not found",
      });
    }
    res.json({ success: true, posts: searchResult });
  } catch (e) {
    res.status(500).send({ success: false, message: e.message });
  }
});

router.get("/posts", isAutherized, async (req, res) => {
  try {
    const { skip, limit } = { ...req.query };
    const { posts, number } = await findAllPosts(skip, limit);
    res.status(200).json({ posts, number });
  } catch (e) {
    res.json(e.message);
  }
});

router.get("/post/:id", isAutherized, async (req, res) => {
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
    const post = await createPost(req.userid, title, body);
    res.json(post);
  } catch (e) {
    res.send(e.message);
  }
});

router.delete("/post/:id", isAutherized, async (req, res) => {
  try {
    const deletedPost = await deletePost(req.params.id);
    res.json(deletedPost);
  } catch (e) {
    res.send(e.message);
  }
});

module.exports = router;

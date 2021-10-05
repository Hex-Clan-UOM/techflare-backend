const express = require("express");
const router = express.Router();
const { isAutherized } = require("../express-middleware");
const logger = require("../commons/logger");
const { findUserFromToken } = require("../services/").userService;
const { findAllPosts, findPostById, createPost, searchPosts } =
  require("../services").postService;

router.get("/posts/search", isAutherized, async (req, res) => {
  try {
    const { value, skip, limit } = { ...req.query };
    const searchResult = await searchPosts(value, skip, limit);
    if (!searchResult || searchResult.length < 1) {
      return res
        .status(404)
        .send({ sucess: false, message: "search result not found" });
    }
    res.send({ success: true, data: searchResult });
  } catch (e) {
    res.status(500).send({ sucess: false, message: e.message });
  }
});

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
    const post = await createPost(req.userid, title, body);
    res.json(post);
  } catch (e) {
    res.send(e.message);
  }
});

module.exports = router;

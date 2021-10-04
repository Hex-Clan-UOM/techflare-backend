const express = require("express");
const router = express.Router();
const logger = require("../commons/logger");
const { findAllPosts, findPostById } = require("../services");

router.get("/posts", async (req, res) => {
  try {
    const posts = await findAllPosts();
    res.status(200).json(posts);
  } catch (e) {
    res.json(e.message);
  }
});

router.get("/posts/:id", async (req, res) => {
  try {
    const post = await findPostById(req.params.id);
    res.status(200).json(post);
  } catch (e) {
    res.json(e.message);
  }
});

module.exports = router;

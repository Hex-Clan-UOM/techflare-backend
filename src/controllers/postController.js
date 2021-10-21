const express = require("express");
const router = express.Router();
const { isAutherized } = require("../express-middleware");
const {
  findAllPosts,
  findPostById,
  createPost,
  searchPosts,
  deletePost,
  likePost,
  unlikePost,
} = require("../services").postService;
const { updatePost } = require("../services/postService");

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
    res.status(500).json(e.message);
  }
});

router.get("/posts/:id", isAutherized, async (req, res) => {
  try {
    const post = await findPostById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .send({ success: false, message: "post not found" });
    }
    res.status(200).json({ success: true, post });
  } catch (e) {
    res.status(400).json(e.message);
  }
});

router.post("/post", isAutherized, async (req, res) => {
  try {
    const { title, body } = req.body;
    const post = await createPost(req.userid, title, body);
    if (!post) {
      return res.status(400).json(post);
    }
    res.json(post);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.put("/post/:id", isAutherized, async (req, res) => {
  const { title, body } = req.body;
  try {
    const updatedPost = await updatePost(
      req.params.id,
      req.userid,
      title,
      body
    );
    if (!updatedPost) {
      return res.status(400).json("cannot update");
    }

    res.json(updatedPost);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.delete("/post/:id", isAutherized, async (req, res) => {
  try {
    const deletedPost = await deletePost(req.params.id, req.userid);
    if (!deletedPost) {
      return res.status(404).json("cannot delete");
    }
    res.json(deletedPost);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.patch("/post/like/:id", isAutherized, async (req, res) => {
  try {
    const likedPost = await likePost(req.params.id, req.userid);
    if (!likePost) {
      return res.status(400).send({
        success: false,
        message: "unable to like this post. try again",
      });
    }

    res.send({ success: true, message: "you liked", likedPost });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: "some thing wrong please try again later",
    });
  }
});

router.patch("/post/unlike/:id", isAutherized, async (req, res) => {
  try {
    const unlikedPost = await unlikePost(req.params.id, req.userid);
    if (!unlikedPost) {
      return res.status(400).send({
        success: false,
        message: "unable to unlike this post. try again",
      });
    }

    res.send({ success: true, message: "you unliked", unlikedPost });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: "some thing wrong please try again later",
    });
  }
});

module.exports = router;

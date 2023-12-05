const express = require("express");
const { body } = require("express-validator"); // validator

const feedController = require("../controllers/feed");

const router = express.Router();

// GET /feed/posts
router.get("/posts", feedController.getPosts);

// POST /feed/post
router.post("/post", [
    body("title").trim().isLength({ min: 5})        // validation
], feedController.createPost);

module.exports = router;

const express = require("express");
const { body } = require("express-validator"); // validator

const feedController = require("../controllers/feed");

const router = express.Router();

// auth
const isAuth = require("../middleware/is-auth");

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of posts
 *     description: Retrieve a list of posts for user. 
 *     responses:
 *        200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/models/post'
*/
router.get("/posts", isAuth, feedController.getPosts);

// POST /feed/post
router.post(
  "/post",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }), // validation
  ],
  feedController.createPost
);

// Get /feed/post/postId
router.get("/post/:postId", isAuth, feedController.getPostById);

// Put /feed/post/postId
router.put(
  "/post/:postId",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }), // validation
  ],
  feedController.updatePost
);

// Delete
router.delete("/post/:postId", isAuth, feedController.deletePost);

module.exports = router;

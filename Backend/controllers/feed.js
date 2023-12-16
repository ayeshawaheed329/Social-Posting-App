const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

// models
const Post = require("../models/post");
const User = require("../models/user");

// get list of posts 
exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  Post.find()
    .countDocuments()
    .then(count => {
      totalItems = count;
      return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(posts => {
      res
        .status(200)
        .json({
          message: 'Fetched posts successfully.',
          posts: posts,
          totalItems: totalItems
        });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.userId
  });
  try {
    await post.save();
    const user = await User.findById(req.userId);
    user.posts.push(post);
    await user.save();
    io.getIO().emit('posts', {
      action: 'create',
      post: { ...post._doc, creator: { _id: req.userId, name: user.name } }
    });
    res.status(201).json({
      message: 'Post created successfully!',
      post: post,
      creator: { _id: user._id, name: user.name }
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


// get particular post
exports.getPostById = (req, res, next) => {
  const postId = req?.params?.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
      }
      console.log("post ", post);
      res.status(200).json({
        message: "Post found",
        post: post,
      });
    })
    .catch((err) => {
      next(err);
    });
};

// Update post
exports.updatePost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors?.isEmpty()) {
    const error = new Error("Validation failed. Please input correct data");
    error.statusCode = 422;
    throw error;
  }
  if (!req?.file) {
    const error = new Error("No image provided");
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path.replace("\\", "/");
  const postId = req?.params?.postId;
  const title = req?.body?.title;
  const content = req.body.content;

  Post.findById(postId)
    .then((post) => {
      if( post.creator?.toString() !== req?.userId){
        const error = new Error("Unauthorized");
        error.statusCode = 403;
        throw error;
      }
      if( post.imageUrl !== imageUrl){
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "Post updated successfully!",
        post: result,
      });
    })
    .catch((err) => next(err));
};

const clearImage = filePath => {
  const fPath = path.join(__dirname, '..', filePath);
  fs.unlink(fPath, err => console.log(err));
}


// Delete post
exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if( post.creator?.toString() !== req?.userId){
        const error = new Error("Unauthorized");
        error.statusCode = 403;
        throw error;
      }
      if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }
      // Check logged in user
      // clearImage(post.imageUrl);
      return Post.findOneAndDelete(postId);
    })
    .then(result => {
      console.log(result);
      res.status(200).json({ message: 'Deleted post.' });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

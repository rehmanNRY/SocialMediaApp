// post.routes.js
import express from 'express';
import { fetchUser } from '../middleware/fetchUser.js';
import {
  createPost,
  getAllPosts,
  editPost,
  deletePost,
  toggleLikePost,
  getPostLikers,
  votePollOption,
  getPollResults,
  getPostById,
} from '../controllers/post.controllers.js';
import upload from '../config/multer.js';

const router = express.Router();

// Route to create a new post
router.post("/", fetchUser, upload.single("image"), createPost);

// Route to get all posts of all users
router.get('/', getAllPosts);

// Route to get specific post
router.get('/:id', getPostById);

// Route to edit own post
router.put('/:postId', fetchUser, editPost);

// Route to delete own post
router.delete('/:postId', fetchUser, deletePost);

// Route to like or unlike a post
router.post('/:postId/like', fetchUser, toggleLikePost);

// Route to get the list of all users who liked a post
router.get('/:postId/likers', getPostLikers);

// Route to vote on a poll option
router.post('/:postId/poll/:optionId/vote', fetchUser, votePollOption);

// Route to get poll results
router.get('/:postId/poll/results', getPollResults);

export default router;

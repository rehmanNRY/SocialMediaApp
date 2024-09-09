// post.routes.js
import express from 'express';
import { fetchUser } from '../middleware/fetchUser.js';
import {
  createPost,
  getAllPosts,
  editPost,
  deletePost,
  toggleLikePost,
  getPostLikers
} from '../controllers/post.controllers.js';

const router = express.Router();

// Route to create a new post
router.post('/', fetchUser, createPost);

// Route to get all posts of all users
router.get('/', getAllPosts);

// Route to edit own post
router.put('/:postId', fetchUser, editPost);

// Route to delete own post
router.delete('/:postId', fetchUser, deletePost);

// Route to like or unlike a post
router.post('/:postId/like', fetchUser, toggleLikePost);

// Route to get the list of all users who liked a post
router.get('/:postId/likers', getPostLikers);

export default router;

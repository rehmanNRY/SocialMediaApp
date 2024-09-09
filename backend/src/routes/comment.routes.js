// comment.routes.js
import express from 'express';
import { fetchUser } from '../middleware/fetchUser.js';
import {
    postComment,
    editComment,
    deleteComment,
    getCommentsByPost,
    toggleLikeComment,
    getUsersWhoLikedComment
} from '../controllers/comment.controllers.js';

const router = express.Router();

// Route to post a comment
router.post('/post', fetchUser, postComment);

// Route to edit a comment
router.put('/edit', fetchUser, editComment);

// Route to delete a comment
router.delete('/delete', fetchUser, deleteComment);

// Route to get all comments of a specific post
router.get('/post/:postId', getCommentsByPost);

// Route to like or dislike a comment
router.post('/like', fetchUser, toggleLikeComment);

// Route to get the list of users who liked a comment
router.get('/likes/:commentId', getUsersWhoLikedComment);

export default router;

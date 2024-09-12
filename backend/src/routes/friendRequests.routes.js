// friendRequest.routes.js
import express from 'express';
import { fetchUser } from '../middleware/fetchUser.js';
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getSentRequests,
  getReceivedRequests,
  getFriendsList,
  cancelSentRequest,
  unfriend,
} from '../controllers/friendRequests.controllers.js';

const router = express.Router();

// Route to send a friend request
router.post('/send', fetchUser, sendFriendRequest);

// Route to accept a friend request
router.post('/accept', fetchUser, acceptFriendRequest);

// Route to reject or delete a friend request
router.delete('/reject', fetchUser, rejectFriendRequest);

// Route to get list of sent requests
router.get('/sent', fetchUser, getSentRequests);

// Route to get list of received requests
router.get('/received', fetchUser, getReceivedRequests);

// Route to get list of all friends
router.get('/friends', fetchUser, getFriendsList);

// Route to cancel a sent friend request
router.delete('/cancel', fetchUser, cancelSentRequest);

// Route to unfriend a friend
router.delete('/unfriend', fetchUser, unfriend);

export default router;

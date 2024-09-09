// user.routes.js
import express from 'express';
import { fetchUser } from '../middleware/fetchUser.js';
import {
  registerUser,
  getUserDetails,
  loginUser,
  resetPassword,
  updateUserDetails,
  getAllUsers,
  userDetails,
} from '../controllers/user.controllers.js';

const router = express.Router();

// Route to register a new user
router.post('/register', registerUser);

// Route to login a user
router.post('/login', loginUser);

// Route to get details of the logged-in user
router.get('/me', fetchUser, getUserDetails);

// Route to get details of user using id
router.get('/userDetails', userDetails);

// Route to reset the password
router.put('/reset-password', fetchUser, resetPassword);

// Route to update user details (name and bio)
router.put('/update', fetchUser, updateUserDetails);

// Route to get all users
router.get('/', getAllUsers);

export default router;

// user.routes.js
import express from 'express';
import { fetchUser } from '../middleware/fetchUser.js';
import {
  registerUser,
  getUserDetails,
  loginUser,
  getAllUsers,
  userDetails,
  updateUser,
} from '../controllers/user.controllers.js';

const router = express.Router();

// Route to register a new user
router.post('/register', registerUser);

// Route to login a user
router.post('/login', loginUser);

// Route to get details of the logged-in user
router.get('/me', fetchUser, getUserDetails);

// Route to get details of user using id
router.get('/userDetails/:userId', userDetails);

// Route to get all users
router.get('/', getAllUsers);

// Route to update the user profile
router.put('/update', fetchUser, updateUser); 

export default router;
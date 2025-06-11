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
  updateUserAvatar,
  updateUserCover,
  checkUsernameExists,
  checkEmailExists,
  registerGoogleUser,
} from '../controllers/user.controllers.js';
import upload from '../config/multer.js';

const router = express.Router();

// Route to register a new user
router.post('/register', registerUser);

// Route to login a user
router.post('/login', loginUser);

// Route to check if username exists
router.get('/check-username/:username', checkUsernameExists);

// Route to check if email exists
router.get('/check-email/:email', checkEmailExists);

// Route to register user via Google
router.post('/register/google', registerGoogleUser);

// Route to get details of the logged-in user
router.get('/me', fetchUser, getUserDetails);

// Route to get details of user using id
router.get('/userDetails/:userId', userDetails);

// Route to get all users
router.get('/', getAllUsers);

// Route to update the user profile
router.put('/update', fetchUser, updateUser); 

// Route to update profile picture (avatar)
router.put('/update/avatar', fetchUser, upload.single('profilePicture'), updateUserAvatar);

// Route to update cover image
router.put('/update/cover', fetchUser, upload.single('coverImage'), updateUserCover);

export default router;
// user.controller.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { FriendRequest } from '../models/friendRequests.model.js';

// Register a new user
export const registerUser = asyncHandler(async (req, res, next) => {
  const { username, fullName, email, password } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ApiError(400, 'User with this email already exists'));
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const user = await User.create({
    username,
    fullName,
    email,
    password: hashedPassword,
  });

  res.status(201).json(new ApiResponse(201, 'User registered successfully', { id: user._id }));
});

// Get details of the logged-in user
export const getUserDetails = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const user = await User.findById(userId).select('-password');
  if (!user) {
    return next(new ApiError(404, 'User not found'));
  }

  res.status(200).json(new ApiResponse(200, 'User details fetched successfully', user));
});

// Get details of the user using id
export const userDetails = asyncHandler(async (req, res, next) => {
  // Access userId from the URL parameters
  const { userId } = req.params;

  // Fetch the user from the database
  const user = await User.findById(userId).select('-password');

  // Check if user exists
  if (!user) {
    return next(new ApiError(404, 'User not found'));
  }

  // Get the list of users who have sent friend requests to this user (followers)
  const followers = await FriendRequest.find({ receiver: userId }).select('sender');
  const followersList = followers.map((request) => request.sender);

  // Get the list of users to whom this user has sent friend requests (following)
  const following = await FriendRequest.find({ sender: userId }).select('receiver');
  const followingList = following.map((request) => request.receiver);

  // Send the user details along with followers and following lists in the response
  res.status(200).json(
    new ApiResponse(200, 'User details fetched successfully', {
      ...user.toObject(),
      followers: followersList,
      following: followingList,
    })
  );
});


// Login a user
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError(400, 'Invalid credentials'));
  }

  // Check the password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ApiError(400, 'Invalid credentials'));
  }

  // Generate JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.status(200).json(new ApiResponse(200, 'User logged in successfully', { token }));
});

// Reset password
export const resetPassword = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { newPassword } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return next(new ApiError(404, 'User not found'));
  }

  // Hash the new password
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.status(200).json(new ApiResponse(200, 'Password reset successfully'));
});

// Update user details (name and bio)
export const updateUserDetails = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { fullName, bio } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return next(new ApiError(404, 'User not found'));
  }

  user.fullName = fullName || user.fullName;
  user.bio = bio || user.bio;
  await user.save();

  res.status(200).json(new ApiResponse(200, 'User details updated successfully', user));
});

// Get all users
export const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().select('-password -email');

  res.status(200).json(new ApiResponse(200, 'All users fetched successfully', users));
});


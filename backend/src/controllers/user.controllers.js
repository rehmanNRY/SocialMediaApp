// user.controller.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { FriendRequest } from '../models/friendRequests.model.js';
import mongoose from 'mongoose';

const profilePictures = [
  "https://res.cloudinary.com/datvbo0ey/image/upload/v1726651745/3d%20avatar/1_ijpza2.png",
  "https://img.freepik.com/premium-photo/3d-avatar-boy-character_914455-603.jpg",
  "https://res.cloudinary.com/datvbo0ey/image/upload/v1726651746/3d%20avatar/8_ff3tta.png",
  "https://res.cloudinary.com/datvbo0ey/image/upload/v1726651745/3d%20avatar/3_bmxh2t.png",
  "https://res.cloudinary.com/datvbo0ey/image/upload/v1726651746/3d%20avatar/9_s4mvtd.png",
  "https://res.cloudinary.com/datvbo0ey/image/upload/v1726651746/3d%20avatar/7_uimci3.png",
  "https://res.cloudinary.com/datvbo0ey/image/upload/v1726651745/3d%20avatar/4_d2vuip.png",
  "https://res.cloudinary.com/datvbo0ey/image/upload/v1726651746/3d%20avatar/5_xhf1vy.png",
  "https://res.cloudinary.com/datvbo0ey/image/upload/v1726651746/3d%20avatar/6_pksp2n.png",
  "https://res.cloudinary.com/datvbo0ey/image/upload/v1726651745/3d%20avatar/3_bmxh2t.png",
];

const coverImages = [
  "https://t3.ftcdn.net/jpg/05/38/74/02/360_F_538740200_HNOc2ABQarAJshNsLB4c3DXAuiCLl2QI.jpg",
  "https://t4.ftcdn.net/jpg/05/34/78/37/360_F_534783787_w337He2LnkNIgJ0J26y6CYZpmios8aUk.jpg",
  "https://img.freepik.com/free-photo/light-background-with-sunset-projector-lamp_53876-128374.jpg",
  "https://t4.ftcdn.net/jpg/08/26/27/49/360_F_826274943_kQB6Hqf5oQ4lveeRAHuqaQxHQKMYH6h0.jpg",
  "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA4L3Jhd3BpeGVsb2ZmaWNlMjBfM2RfbW9kZXJuX3dhdmVfY3VydmVfYWJzdHJhY3RfaGFsZnRvbmVfZ3JhZGllbl8xZTJhY2M3Mi1jZTU3LTQ0NjItOGQzNS1lOTI4YzI5NzcxMTdfMS5qcGc.jpg",
  "https://t3.ftcdn.net/jpg/05/38/74/02/360_F_538740200_HNOc2ABQarAJshNsLB4c3DXAuiCLl2QI.jpg",
  "https://t4.ftcdn.net/jpg/05/34/78/37/360_F_534783787_w337He2LnkNIgJ0J26y6CYZpmios8aUk.jpg",
  "https://img.freepik.com/free-photo/light-background-with-sunset-projector-lamp_53876-128374.jpg",
  "https://t4.ftcdn.net/jpg/08/26/27/49/360_F_826274943_kQB6Hqf5oQ4lveeRAHuqaQxHQKMYH6h0.jpg",
  "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA4L3Jhd3BpeGVsb2ZmaWNlMjBfM2RfbW9kZXJuX3dhdmVfY3VydmVfYWJzdHJhY3RfaGFsZnRvbmVfZ3JhZGllbl8xZTJhY2M3Mi1jZTU3LTQ0NjItOGQzNS1lOTI4YzI5NzcxMTdfMS5qcGc.jpg"
];

// Check if username exists
export const checkUsernameExists = asyncHandler(async (req, res, next) => {
  const { username } = req.params;
  
  const existingUser = await User.findOne({ username });
  
  res.status(200).json(new ApiResponse(200, 'Username check completed', { 
    exists: !!existingUser,
    available: !existingUser 
  }));
});

// Check if email exists
export const checkEmailExists = asyncHandler(async (req, res, next) => {
  const { email } = req.params;
  
  const existingUser = await User.findOne({ email });
  
  res.status(200).json(new ApiResponse(200, 'Email check completed', { 
    exists: !!existingUser,
    available: !existingUser,
    loggedInVia: existingUser ? existingUser.loggedInVia : null
  }));
});

// Register a new user
export const registerUser = asyncHandler(async (req, res, next) => {
  const { username, fullName, email, password } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ApiError(400, 'User with this email already exists'));
  }

  // Check if username already exists
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    return next(new ApiError(400, 'Username already exists'));
  }

  // Get the current count of users to determine profile picture assignment
  const userCount = await User.countDocuments();

  // Calculate the profile picture and cover index
  const profilePictureIndex = userCount % profilePictures.length;
  const assignedProfilePicture = profilePictures[profilePictureIndex];

  const assignedCoverPicture = coverImages[profilePictureIndex];

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user with an assigned profile picture
  const user = await User.create({
    username,
    fullName,
    email,
    password: hashedPassword,
    loggedInVia: 'email',
    profilePicture: assignedProfilePicture || "https://res.cloudinary.com/datvbo0ey/image/upload/v1726651745/3d%20avatar/1_ijpza2.png",
    coverImage: assignedCoverPicture || "https://t3.ftcdn.net/jpg/05/38/74/02/360_F_538740200_HNOc2ABQarAJshNsLB4c3DXAuiCLl2QI.jpg",
  });

  if (!user) {
    throw new ApiError(500, "Something went wrong while registering a user");
  }

  return res.status(201).json(new ApiResponse(201, 'User registered successfully', { id: user._id }));
});

// Register user via Google
export const registerGoogleUser = asyncHandler(async (req, res, next) => {
  const { username, fullName, email, profilePicture } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    // If user exists, generate token and return
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
    return res.status(200).json(new ApiResponse(200, 'User logged in successfully', { token }));
  }

  // Check if username already exists
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    return next(new ApiError(400, 'Username already exists'));
  }

  // Get the current count of users to determine profile picture assignment
  const userCount = await User.countDocuments();

  // Calculate the cover index
  const coverIndex = userCount % coverImages.length;
  const assignedCoverPicture = coverImages[coverIndex];

  // Create a new user
  const user = await User.create({
    username,
    fullName,
    email,
    loggedInVia: 'google',
    profilePicture: profilePicture || profilePictures[userCount % profilePictures.length],
    coverImage: assignedCoverPicture,
  });

  if (!user) {
    throw new ApiError(500, "Something went wrong while registering a user");
  }

  // Generate JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  return res.status(201).json(new ApiResponse(201, 'User registered successfully', { token }));
});

// Login a user
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError(400, 'Invalid credentials'));
  }

  // Check if user registered via Google
  if (user.loggedInVia === 'google') {
    return next(new ApiError(400, 'Account created via Google. Please login using Google.'));
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

// Get all users
export const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().select('-password -email');

  res.status(200).json(new ApiResponse(200, 'All users fetched successfully', users));
});

// Update user profile
export const updateUser = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const {
    username,
    fullName,
    email,
    password,
    profilePicture,
    coverImage,
    location,
    bio,
    dob,
    isDpVerify,
  } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  try {
    if (username) user.username = username;
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (password) user.password = password;
    if (profilePicture) user.profilePicture = profilePicture;
    if (coverImage) user.coverImage = coverImage;
    if (location) user.location = location;
    if (bio) user.bio = bio;
    if (dob) user.dob = dob;
    if (isDpVerify) user.isDpVerify = isDpVerify;

    await user.save();
    res.json({ data: user });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      // Format errors for the frontend
      const errors = {};
      for (let field in err.errors) {
        errors[field] = {
          message: err.errors[field].message
        };
      }
      return res.status(400).json({ errors });
    }
    next(err);
  }
});

// Update only profile picture via Cloudinary upload or URL
export const updateUserAvatar = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const uploadedUrl = req.file?.path || req.file?.secure_url || null;
  const urlFromBody = req.body?.profilePicture || null;
  const finalUrl = uploadedUrl || urlFromBody;

  if (!finalUrl) {
    return next(new ApiError(400, 'No image provided'));
  }

  user.profilePicture = finalUrl;
  await user.save();
  return res.status(200).json(new ApiResponse(200, 'Profile picture updated successfully', user));
});

// Update only cover image via Cloudinary upload or URL
export const updateUserCover = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const uploadedUrl = req.file?.path || req.file?.secure_url || null;
  const urlFromBody = req.body?.coverImage || null;
  const finalUrl = uploadedUrl || urlFromBody;

  if (!finalUrl) {
    return next(new ApiError(400, 'No image provided'));
  }

  user.coverImage = finalUrl;
  await user.save();
  return res.status(200).json(new ApiResponse(200, 'Cover image updated successfully', user));
});

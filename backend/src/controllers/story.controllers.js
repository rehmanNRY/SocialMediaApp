// story.controllers.js
import { Story } from '../models/story.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Create a story
export const createStory = asyncHandler(async (req, res, next) => {
  const { content, image } = req.body;
  const userId = req.user.id;

  // Validate the content length
  if (content && content.length > 100) {
    return next(new ApiError(400, 'Content exceeds 100 characters limit'));
  }

  // Create the story
  const story = await Story.create({
    user: userId,
    content,
    image,
  });

  const populateStory = await Story.findById(story._id)
  .populate('user', 'fullName profilePicture');

  res.status(201).json(new ApiResponse(201, 'Story created successfully', populateStory));
});

// Delete a story by ID
export const deleteStory = asyncHandler(async (req, res, next) => {
  const { storyId } = req.params;
  const userId = req.user.id;

  const story = await Story.findById(storyId);

  if (!story) {
    return next(new ApiError(404, 'Story not found'));
  }

  // Check if the story belongs to the logged-in user
  if (story.user.toString() !== userId) {
    return next(new ApiError(403, 'You are not authorized to delete this story'));
  }

  await story.remove();

  res.status(200).json(new ApiResponse(200, 'Story deleted successfully'));
});

// Automatically delete stories older than 24 hours
export const autoDeleteStories = asyncHandler(async (req, res, next) => {
  const now = new Date();
  // Find and delete all stories that have expired
  const deletedStories = await Story.deleteMany({ expiresAt: { $lte: now } });

  res.status(200).json(new ApiResponse(200, 'Expired stories deleted', { count: deletedStories.deletedCount }));
});

// Get all stories of all users
export const getAllStories = asyncHandler(async (req, res, next) => {
  const stories = await Story.find()
    .populate('user', 'fullName profilePicture username coverImage')
    .sort('-createdAt');

  res.status(200).json(new ApiResponse(200, 'Stories fetched successfully', stories));
});

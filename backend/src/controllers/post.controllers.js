// post.controller.js
import { Post } from '../models/post.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Comment } from '../models/comment.model.js';

// Create a new post
export const createPost = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { content, image } = req.body;

    // Create the new post
    const post = await Post.create({ user: userId, content, image });

    // Fetch the new post with populated user details (like in getAllPosts)
    const populatedPost = await Post.findById(post._id)
      .populate('user', 'fullName profilePicture') // Populate post's user details
      .populate('likes', 'fullName') // Populate post's likes with user details
      .lean();

    // Add an empty comments array
    const postWithComments = { ...populatedPost, comments: [] };

    res.status(201).json(new ApiResponse(201, 'Post created successfully', postWithComments));
  } catch (error) {
    next(new ApiError(500, 'Failed to create post'));
  }
});


// Get all posts of all users along with comments and user details
export const getAllPosts = asyncHandler(async (req, res, next) => {
  try {
    // Fetch all posts with populated user and likes fields
    const posts = await Post.find()
      .populate('user', 'fullName profilePicture')
      .populate('likes', 'fullName') // Populate post's likes with user details
      .lean(); // Use .lean() for better performance and mutability

    // Map through each post to get the comments and their respective user details
    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        // Fetch comments for the current post and populate the user details
        const comments = await Comment.find({ post: post._id })
          .populate('user', 'fullName') // Populate comment's user details
          .lean();

        // Add the comments array to each post
        return { ...post, comments };
      })
    );

    res.status(200).json(new ApiResponse(200, 'All posts fetched successfully', postsWithComments));
  } catch (error) {
    next(new ApiError(500, 'Failed to fetch posts'));
  }
});


// Edit own post
export const editPost = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { postId } = req.params;
  const { content, image } = req.body;

  // Find the post and ensure it belongs to the logged-in user
  const post = await Post.findOne({ _id: postId, user: userId });
  if (!post) {
    return next(new ApiError(404, 'Post not found or you are not authorized to edit this post'));
  }

  // Update the post
  post.content = content || post.content;
  post.image = image || post.image;
  await post.save();

  const populatedPost = await Post.findById(post._id)
  .populate('user', 'fullName profilePicture') // Populate post's user details
  .lean();

  res.status(200).json(new ApiResponse(200, 'Post updated successfully', populatedPost));
});

// Delete own post
export const deletePost = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { postId } = req.params;

  // Find the post and ensure it belongs to the logged-in user
  const post = await Post.findOneAndDelete({ _id: postId, user: userId });
  if (!post) {
    return next(new ApiError(404, 'Post not found or you are not authorized to delete this post'));
  }

  res.status(200).json(new ApiResponse(200, 'Post deleted successfully'));
});

// Like or unlike a post
export const toggleLikePost = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { postId } = req.params;

  const post = await Post.findById(postId);
  if (!post) {
    return next(new ApiError(404, 'Post not found'));
  }

  // Check if the user already liked the post
  const hasLiked = post.likes.includes(userId);

  if (hasLiked) {
    // Unlike the post
    post.likes.pull(userId);
  } else {
    // Like the post
    post.likes.push(userId);
  }

  await post.save();
  const populatedPost = await Post.findById(post._id)
  .populate('user', 'fullName profilePicture') // Populate post's user details
  .lean();

  res.status(200).json(new ApiResponse(200, hasLiked ? 'Post unliked' : 'Post liked', populatedPost));
});

// List of all users who liked a post
export const getPostLikers = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findById(postId).populate('likes', 'fullName profilePicture');
  if (!post) {
    return next(new ApiError(404, 'Post not found'));
  }

  res.status(200).json(new ApiResponse(200, 'List of likers fetched successfully', post.likes));
});

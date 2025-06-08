// post.controller.js
import { Post } from '../models/post.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Comment } from '../models/comment.model.js';
import { Notification } from '../models/notification.model.js';
import { User } from '../models/user.model.js';

// Create a new post
export const createPost = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user.id;
    let { content, backgroundColor, pollData, feeling } = req.body;

    // If pollData comes via multipart/form-data, it will be a string
    if (typeof pollData === 'string') {
      try {
        pollData = JSON.parse(pollData);
      } catch (_) {
        // ignore parse failure, treat as absent/invalid
      }
    }

    // Prefer uploaded file (Cloudinary) over URL when both are present
    const uploadedImageUrl = req.file?.path || req.file?.secure_url || null;
    const image = uploadedImageUrl || (req.body.image ? req.body.image : null);

    // Create post object with basic fields
    const postData = { 
      content, 
      image,
      feeling,
      backgroundColor: backgroundColor || 'bg-white',
      user: userId, 
    };

    // Add poll data if provided
    if (pollData && pollData.options && pollData.options.length >= 2) {
      const pollOptions = pollData.options.map(option => ({
        text: option,
        votes: []
      }));

      // Calculate poll end date based on duration in hours
      const endDate = new Date();
      endDate.setHours(endDate.getHours() + (pollData.duration || 24));

      postData.poll = {
        options: pollOptions,
        endDate: endDate,
        active: true
      };
    }

    // Create the new post
    const post = await Post.create(postData);

    // Fetch the new post with populated user details
    const populatedPost = await Post.findById(post._id)
      .populate('user', 'fullName profilePicture username')
      .populate('likes', 'fullName')
      .populate('poll.options.votes', 'fullName username profilePicture')
      .lean();

    res.status(201).json(new ApiResponse(201, 'Post created successfully', populatedPost));
  } catch (error) {
    next(new ApiError(500, 'Failed to create post'));
  }
});

// Get all posts of all users along with comments and user details
export const getAllPosts = asyncHandler(async (req, res, next) => {
  try {
    // Fetch all posts with populated user and likes fields
    const posts = await Post.find()
      .populate('user', 'fullName profilePicture username')
      .populate('likes', 'fullName')
      .populate('poll.options.votes', 'fullName username profilePicture')
      .lean(); // Use .lean() for better performance and mutability

    // Check if any polls have expired and update their active status
    const now = new Date();
    const updatedPosts = posts.map(post => {
      if (post.poll && post.poll.endDate && post.poll.active) {
        if (new Date(post.poll.endDate) < now) {
          post.poll.active = false;
        }
      }
      return post;
    });

    res.status(200).json(new ApiResponse(200, 'All posts fetched successfully', updatedPosts));
  } catch (error) {
    next(new ApiError(500, 'Failed to fetch posts'));
  }
});

// get specific post by id
export const getPostById = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the post by ID and populate necessary fields
    const post = await Post.findById(id)
      .populate('user', 'fullName profilePicture username')
      .populate('likes', 'fullName')
      .populate('poll.options.votes', 'fullName username profilePicture')
      .lean();

    if (!post) {
      return next(new ApiError(404, 'Post not found'));
    }

    // Check if the poll has expired and update its active status
    const now = new Date();
    if (post.poll && post.poll.endDate && post.poll.active) {
      if (new Date(post.poll.endDate) < now) {
        post.poll.active = false;
      }
    }

    res.status(200).json(new ApiResponse(200, 'Post fetched successfully', post));
  } catch (error) {
    next(new ApiError(500, 'Failed to fetch post'));
  }
});


// Edit own post
export const editPost = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { postId } = req.params;
  const { content, image, backgroundColor } = req.body;

  // Find the post and ensure it belongs to the logged-in user
  const post = await Post.findOne({ _id: postId, user: userId });
  if (!post) {
    return next(new ApiError(404, 'Post not found or you are not authorized to edit this post'));
  }

  // Update the post
  post.content = content || post.content;
  post.image = image || post.image;
  post.backgroundColor = backgroundColor || post.backgroundColor;
  await post.save();

  const populatedPost = await Post.findById(post._id)
    .populate('user', 'fullName profilePicture username')
    .populate('likes', 'fullName')
    .populate('poll.options.votes', 'fullName username profilePicture')
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

  // Delete all comments associated with the deleted post
  await Comment.deleteMany({ post: postId });

  res.status(200).json(new ApiResponse(200, 'Post and its comments deleted successfully'));
});

// Like or unlike a post
export const toggleLikePost = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { postId } = req.params;
  const { fullName } = await User.findById(userId);

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
    
    // Create notification for post owner if the liker is not the post owner
    if (post.user.toString() !== userId) {
      await Notification.create({
        senderUser: userId,
        receiverUser: post.user,
        message: `${fullName} liked your post`,
        navigateLink: `/posts/${postId}`,
      });
    }
  }

  await post.save();
  const populatedPost = await Post.findById(post._id)
    .populate('user', 'fullName profilePicture username')
    .populate('likes', 'fullName')
    .populate('poll.options.votes', 'fullName username profilePicture')
    .lean();

  res.status(200).json(new ApiResponse(200, hasLiked ? 'Post unliked' : 'Post liked', populatedPost));
});

// List of all users who liked a post
export const getPostLikers = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findById(postId).populate('likes', 'fullName profilePicture username');
  if (!post) {
    return next(new ApiError(404, 'Post not found'));
  }

  res.status(200).json(new ApiResponse(200, 'List of likers fetched successfully', post.likes));
});

// Vote on a poll option
export const votePollOption = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { fullName } = await User.findById(userId);
  const { postId, optionId } = req.params;

  const post = await Post.findById(postId);
  if (!post) {
    return next(new ApiError(404, 'Post not found'));
  }

  // Check if poll exists and is active
  if (!post.poll || !post.poll.active) {
    return next(new ApiError(400, 'Poll is not active or does not exist'));
  }

  // Check if poll has expired
  if (post.poll.endDate && new Date(post.poll.endDate) < new Date()) {
    post.poll.active = false;
    await post.save();
    return next(new ApiError(400, 'Poll has expired'));
  }

  // Find the option
  const option = post.poll.options.id(optionId);
  if (!option) {
    return next(new ApiError(404, 'Poll option not found'));
  }

  // Check if user has already voted on any option
  let userHasVoted = false;
  let previousVoteOptionId = null;

  for (const opt of post.poll.options) {
    if (opt.votes.includes(userId)) {
      userHasVoted = true;
      previousVoteOptionId = opt._id;
      break;
    }
  }

  // If user has already voted, remove their vote from the previous option
  if (userHasVoted) {
    const previousOption = post.poll.options.id(previousVoteOptionId);
    previousOption.votes.pull(userId);
  }

  // Add user's vote to the selected option
  option.votes.push(userId);
  await post.save();
  
  // Create notification for post owner if the voter is not the post owner
  if (!userHasVoted && post.user.toString() !== userId) {
    await Notification.create({
      senderUser: userId,
      receiverUser: post.user,
      message: `${fullName} voted on your poll`,
      navigateLink: `/posts/${postId}`,
    });
  }

  // Return the updated post with populated fields
  const populatedPost = await Post.findById(post._id)
    .populate('user', 'fullName profilePicture username')
    .populate('likes', 'fullName')
    .populate('poll.options.votes', 'fullName username profilePicture')
    .lean();

  res.status(200).json(new ApiResponse(200, 'Vote recorded successfully', populatedPost));
});

// Get poll results
export const getPollResults = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findById(postId)
    .populate('poll.options.votes', 'fullName username profilePicture');
  
  if (!post || !post.poll) {
    return next(new ApiError(404, 'Post or poll not found'));
  }

  // Calculate total votes
  let totalVotes = 0;
  post.poll.options.forEach(option => {
    totalVotes += option.votes.length;
  });

  // Calculate percentages and prepare results
  const results = post.poll.options.map(option => ({
    _id: option._id,
    text: option.text,
    votes: option.votes,
    voteCount: option.votes.length,
    percentage: totalVotes > 0 ? Math.round((option.votes.length / totalVotes) * 100) : 0
  }));

  res.status(200).json(new ApiResponse(200, 'Poll results fetched successfully', {
    results,
    totalVotes,
    active: post.poll.active,
    endDate: post.poll.endDate
  }));
});

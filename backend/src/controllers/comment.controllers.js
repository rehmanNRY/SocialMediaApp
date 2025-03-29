import { Comment } from '../models/comment.model.js';
import { Post } from '../models/post.model.js';
import { Notification } from '../models/notification.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';

// Controller to post a comment
export const postComment = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { fullName } = await User.findById(userId);
  const { post, content } = req.body;

  const comment = await Comment.create({
    post,
    user: userId,
    content,
  });

  const populatedComment = await Comment.findById(comment._id)
    .populate('user', 'fullName profilePicture') // Populate post's user details
    .lean();

  // Find post owner to send notification
  const postData = await Post.findById(post);
  
  // Send notification to post owner if commenter is not the post owner
  if (postData && postData.user.toString() !== userId) {
    await Notification.create({
      senderUser: userId,
      receiverUser: postData.user,
      message: `${fullName} commented on your post: "${content.substring(0, 30)}${content.length > 25 ? '...' : ''}"`,
      navigateLink: `/posts/${post}`,
    });
  }

  res.status(201).json(new ApiResponse(201, 'Comment posted successfully', populatedComment));
});

// Controller to edit a comment
export const editComment = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { commentId, content } = req.body;

  // Find the comment and ensure the user owns it
  const comment = await Comment.findOne({ _id: commentId, user: userId });
  if (!comment) {
    return next(new ApiError(404, 'Comment not found or unauthorized'));
  }

  // Update the comment content
  comment.content = content;
  await comment.save();

  const populatedComment = await Comment.findById(comment._id)
    .populate('user', 'fullName profilePicture') // Populate post's user details
    .lean();

  res.status(200).json(new ApiResponse(200, 'Comment updated successfully', populatedComment));
});

// Controller to delete a comment
export const deleteComment = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { commentId } = req.body;

  // Find and delete the comment if the user owns it
  const comment = await Comment.findOneAndDelete({ _id: commentId, user: userId });
  if (!comment) {
    return next(new ApiError(404, 'Comment not found or unauthorized'));
  }

  res.status(200).json(new ApiResponse(200, 'Comment deleted successfully'));
});

// Controller to get all comments of a specific post
export const getCommentsByPost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  // Fetch all comments for the given post
  const comments = await Comment.find({ post: postId }).populate('user', 'fullName profilePicture');

  res.status(200).json(new ApiResponse(200, 'Comments fetched successfully', comments));
});

// Controller to like or dislike a comment
export const toggleLikeComment = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { fullName } = await User.findById(userId);
  const { commentId } = req.body;

  // Find the comment
  const comment = await Comment.findById(commentId);
  if (!comment) {
    return next(new ApiError(404, 'Comment not found'));
  }

  // Check if the user already liked the comment
  const isLiked = comment.likes.includes(userId);
  if (isLiked) {
    // If already liked, remove the like (dislike)
    comment.likes = comment.likes.filter((id) => id.toString() !== userId);
  } else {
    // Otherwise, add the like
    comment.likes.push(userId);
    
    // Send notification if the user is not liking their own comment
    if (comment.user.toString() !== userId) {
      await Notification.create({
        senderUser: userId,
        receiverUser: comment.user,
        message: `${fullName} liked your comment`,
        navigateLink: `/posts/${comment.post}`,
      });
    }
  }

  await comment.save();

  const populatedComment = await Comment.findById(comment._id)
    .populate('user', 'fullName profilePicture') // Populate post's user details
    .lean();

  res.status(200).json(new ApiResponse(200, isLiked ? 'Comment disliked' : 'Comment liked', populatedComment));
});

// Controller to get the list of all users who liked a comment
export const getUsersWhoLikedComment = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;

  // Find the comment and populate the likes with user details
  const comment = await Comment.findById(commentId).populate('likes', 'fullName profilePicture');
  if (!comment) {
    return next(new ApiError(404, 'Comment not found'));
  }

  res.status(200).json(new ApiResponse(200, 'List of users who liked the comment', comment.likes));
});

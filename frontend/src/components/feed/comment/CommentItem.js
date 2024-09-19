// CommentItem.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editComment, deleteComment, toggleLikeComment } from '@/redux/comments/commentsSlice';
import { FiEdit, FiTrash2, FiThumbsUp, FiSave } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { RiThumbUpFill } from "react-icons/ri";
import Link from 'next/link';

const CommentItem = ({ comment }) => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(comment.content);

  const handleEdit = () => {
    if (isEditing) {
      dispatch(editComment({ commentId: comment._id, postId: comment.post, content: newContent }));
    }
    setIsEditing(!isEditing);
  };

  const handleDelete = () => {
    dispatch(deleteComment({ commentId: comment._id, postId: comment.post }));
  };

  const handleLike = () => {
    dispatch(toggleLikeComment({ commentId: comment._id, postId: comment.post }));
  };

  const userHasLiked = comment.likes.includes(userDetails?._id);

  return (
    <div className="flex items-start space-x-4 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition duration-300 shadow-md">
      {/* User Avatar */}
      <Link href={`/profile/${comment.user._id}`}>
        <motion.img
          src={comment.user.profilePicture}
          alt="User Avatar"
          className="w-12 h-12 rounded-full object-cover cursor-pointer"
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        />
      </Link>

      {/* Comment Content */}
      <div className="flex-1">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <Link href={`/profile/${comment.user._id}`} className="font-semibold text-gray-800">{comment.user.fullName}</Link>
          <div className="flex items-center space-x-2">
            {/* Edit and Delete for the User's Own Comment */}
            {userDetails?._id === comment.user._id && (
              <>
                <button
                  onClick={handleEdit}
                  className="text-indigo-500 hover:bg-blue-100 rounded-full transition-colors"
                  aria-label="Edit Comment"
                >
                  {isEditing ? <FiSave /> : <FiEdit />}
                </button>
                <button
                  onClick={handleDelete}
                  className="text-red-500 hover:bg-red-100 p-1 rounded-full transition-colors"
                  aria-label="Delete Comment"
                >
                  <FiTrash2 />
                </button>
              </>
            )}
            {/* Like Button */}
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 hover:text-indigo-500 transition-colors ${
                userHasLiked ? 'text-indigo-500' : 'text-gray-500'
              }`}
            >
              {userHasLiked ? <RiThumbUpFill /> : <FiThumbsUp />}
              <span>{comment.likes.length}</span>
            </button>
          </div>
        </div>

        {/* Comment Text Area */}
        {isEditing ? (
          <textarea
            value={newContent}
            maxLength={100}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-400"
          />
        ) : (
          <p className="mt-2 text-gray-700">{comment.content}</p>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
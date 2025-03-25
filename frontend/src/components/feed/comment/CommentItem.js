// CommentItem.js
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editComment, deleteComment, toggleLikeComment } from '@/redux/comments/commentsSlice';
import { FiEdit, FiTrash2, FiThumbsUp, FiSave, FiClock, FiX, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { RiThumbUpFill, RiChat1Line } from "react-icons/ri";
import Link from 'next/link';

const CommentItem = ({ comment }) => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(comment.content);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(newContent.length, newContent.length);
    }
  }, [isEditing]);

  const handleEdit = () => {
    if (isEditing) {
      dispatch(editComment({ commentId: comment._id, postId: comment.post, content: newContent }));
    }
    setIsEditing(!isEditing);
  };

  const handleDelete = () => {
    if (showConfirmDelete) {
      dispatch(deleteComment({ commentId: comment._id, postId: comment.post }));
      setShowConfirmDelete(false);
    } else {
      setShowConfirmDelete(true);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
  };

  const handleLike = () => {
    dispatch(toggleLikeComment({ commentId: comment._id, postId: comment.post }));
  };

  const userHasLiked = comment.likes.includes(userDetails?._id);
  const isOwnComment = userDetails?._id === comment.user._id;

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      className="flex items-start space-x-4 px-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm transition duration-300"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        borderColor: "#e2e8f0"
      }}
    >
      {/* User Avatar */}
      <Link href={`/profile/${comment.user._id}`}>
        <motion.div
          className="relative"
          whileHover={{ scale: 1.05 }}
        >
          <motion.img
            src={comment.user.profilePicture}
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-indigo-50"
            whileHover={{ borderColor: "#818cf8" }}
            transition={{ type: 'spring', stiffness: 300 }}
          />
          {userHasLiked && (
            <motion.div
              className="absolute -bottom-1 -right-1 bg-indigo-500 rounded-full p-1 shadow-sm"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <RiThumbUpFill className="w-2.5 h-2.5 text-white" />
            </motion.div>
          )}
        </motion.div>
      </Link>

      {/* Comment Content */}
      <div className="flex-1">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <Link href={`/profile/${comment.user._id}`} className="font-semibold text-gray-800 hover:text-indigo-600 transition-colors">
              {comment.user.fullName}
            </Link>
            <div className="flex items-center text-xs text-gray-500">
              <FiClock className="mr-1 w-3 h-3" />
              <span>{formatDate(comment.createdAt)}</span>
            </div>
          </div>

          <AnimatePresence>
            <motion.div
              className="flex items-center space-x-1"
            >
              {/* Edit and Delete for the User's Own Comment */}
              {isOwnComment && !showConfirmDelete && (
                <>
                  <motion.button
                    onClick={handleEdit}
                    className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-full transition-colors"
                    whileHover={{ scale: 1.1, backgroundColor: "#eef2ff" }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Edit Comment"
                  >
                    {isEditing ? <FiSave className="w-4 h-4" /> : <FiEdit className="w-4 h-4" />}
                  </motion.button>
                  <motion.button
                    onClick={handleDelete}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    whileHover={{ scale: 1.1, backgroundColor: "#fee2e2" }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Delete Comment"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </motion.button>
                </>
              )}

              {/* Delete Confirmation */}
              {showConfirmDelete && (
                <motion.div 
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <motion.button
                    onClick={handleDelete}
                    className="px-2.5 py-1.5 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1 shadow-sm"
                    whileHover={{ scale: 1.05, backgroundColor: "#ef4444" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiCheck className="w-3 h-3" />
                    <span>Delete</span>
                  </motion.button>
                  <motion.button
                    onClick={cancelDelete}
                    className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                    whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FiX className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              )}

              {/* Like Button */}
              {!showConfirmDelete && (
                <motion.button
                  onClick={handleLike}
                  className={`flex items-center space-x-1 p-1.5 rounded-full transition-colors ${userHasLiked ? 'text-indigo-500 bg-indigo-50' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  whileHover={{ scale: 1.1, backgroundColor: userHasLiked ? "#eef2ff" : "#f3f4f6" }}
                  whileTap={{ scale: 0.9 }}
                >
                  {userHasLiked ? <RiThumbUpFill className="w-4 h-4" /> : <FiThumbsUp className="w-4 h-4" />}
                  <span className="text-xs font-medium">{comment.likes.length}</span>
                </motion.button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Comment Text Area */}
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="mt-3"
            >
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={newContent}
                  maxLength={100}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none bg-gray-50 text-gray-700"
                  rows={3}
                  placeholder="Edit your comment..."
                />
                <motion.div 
                  className="absolute right-2 bottom-2 flex space-x-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.button
                    onClick={handleEdit}
                    className="px-3 py-1 bg-indigo-500 text-white text-xs rounded-md hover:bg-indigo-600 transition-colors flex items-center gap-1 shadow-sm"
                    whileHover={{ scale: 1.05, backgroundColor: "#4f46e5" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiSave className="w-3 h-3" />
                    <span>Save</span>
                  </motion.button>
                  <motion.button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-md hover:bg-gray-300 transition-colors flex items-center gap-1"
                    whileHover={{ scale: 1.05, backgroundColor: "#e5e7eb" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiX className="w-3 h-3" />
                    <span>Cancel</span>
                  </motion.button>
                </motion.div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <motion.div 
                  className="flex items-center"
                  animate={{ 
                    color: newContent.length > 90 ? "#ef4444" : "#6b7280"
                  }}
                >
                  <RiChat1Line className="mr-1 w-3 h-3" />
                  <span>{newContent.length}/100 characters</span>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.p
              className="mt-2 text-gray-700 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {comment.content}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CommentItem;
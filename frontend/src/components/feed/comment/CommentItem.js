// CommentItem.js
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editComment, deleteComment, toggleLikeComment } from '@/redux/comments/commentsSlice';
import { FiEdit, FiTrash2, FiThumbsUp, FiSave, FiClock, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { RiThumbUpFill } from "react-icons/ri";
import Link from 'next/link';

const CommentItem = ({ comment }) => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(comment.content);
  const [isHovered, setIsHovered] = useState(false);
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
      className="flex items-start space-x-4 px-4 py-3 bg-white border border-gray-200 rounded-xl transition duration-300"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        borderColor: "#e2e8f0"
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
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
            {(isHovered || isEditing || showConfirmDelete) && (
              <motion.div 
                className="flex items-center space-x-1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Edit and Delete for the User's Own Comment */}
                {isOwnComment && !showConfirmDelete && (
                  <>
                    <motion.button
                      onClick={handleEdit}
                      className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-full transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Edit Comment"
                    >
                      {isEditing ? <FiSave className="w-4 h-4" /> : <FiEdit className="w-4 h-4" />}
                    </motion.button>
                    <motion.button
                      onClick={handleDelete}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Delete Comment"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </motion.button>
                  </>
                )}

                {/* Delete Confirmation */}
                {showConfirmDelete && (
                  <div className="flex items-center space-x-1">
                    <motion.button
                      onClick={handleDelete}
                      className="px-2 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Confirm
                    </motion.button>
                    <motion.button
                      onClick={cancelDelete}
                      className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiX className="w-4 h-4" />
                    </motion.button>
                  </div>
                )}

                {/* Like Button */}
                {!showConfirmDelete && (
                  <motion.button
                    onClick={handleLike}
                    className={`flex items-center space-x-1 p-1.5 rounded-full transition-colors ${
                      userHasLiked ? 'text-indigo-500 bg-indigo-50' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {userHasLiked ? <RiThumbUpFill className="w-4 h-4" /> : <FiThumbsUp className="w-4 h-4" />}
                    <span className="text-xs font-medium">{comment.likes.length}</span>
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Comment Text Area */}
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-2"
            >
              <textarea
                ref={textareaRef}
                value={newContent}
                maxLength={100}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none"
                rows={3}
              />
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>{newContent.length}/100 characters</span>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
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

        {/* Comment Image if exists */}
        {comment.image && (
          <motion.div 
            className="mt-3 rounded-lg overflow-hidden"
            whileHover={{ scale: 1.02 }}
          >
            <img 
              src={comment.image} 
              alt="Comment attachment" 
              className="w-full h-auto max-h-48 object-cover rounded-lg"
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CommentItem;
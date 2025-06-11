// CommentItem.js
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editComment, deleteComment, toggleLikeComment } from '@/redux/comments/commentsSlice';
import { FiEdit, FiTrash2, FiSave, FiClock, FiX, FiCheck, FiMessageSquare } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { RiThumbUpFill, RiChat1Line, RiHeartFill, RiHeartLine, RiMoreLine } from "react-icons/ri";
import Link from 'next/link';

const CommentItem = ({ comment }) => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(comment.content);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);
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
    setShowActions(false);
  };

  const handleDelete = () => {
    if (showConfirmDelete) {
      dispatch(deleteComment({ commentId: comment._id, postId: comment.post }));
      setShowConfirmDelete(false);
    } else {
      setShowConfirmDelete(true);
    }
    setShowActions(false);
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
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      className="relative mb-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.1 }} // Reduced duration for faster animation
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div 
        className="relative bg-white rounded-2xl overflow-hidden border border-gray-100"
        animate={{
          boxShadow: isHovered ? "0 10px 30px rgba(0, 0, 0, 0.08)" : "0 2px 10px rgba(0, 0, 0, 0.03)",
          scale: isHovered ? 1.01 : 1
        }}
        transition={{ duration: 0.1 }} // Reduced duration for faster animation
      >
        {/* Comment header with avatar and user info */}
        <div className="flex items-center px-5 pt-4 pb-2">
          <Link href={`/profile/${comment.user._id}`} className="block">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 8 }} // Reduced damping for quicker response
            >
              <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-indigo-100 ring-offset-2">
                <motion.img
                  src={comment.user.profilePicture || 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg'}
                  alt={comment.user.fullName}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.15 }}
                  transition={{ duration: 0.2 }} // Reduced duration for faster animation
                />
              </div>
            </motion.div>
          </Link>
          
          <div className="ml-3 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <Link href={`/profile/${comment.user._id}`} className="font-semibold text-gray-800 hover:text-indigo-600 transition-colors capitalize text-sm">
                  {comment.user.fullName}
                </Link>
                <div className="flex items-center mt-0.5">
                  <span className="text-xs text-gray-500 flex items-center">
                    <FiClock className="w-3 h-3 mr-1 opacity-70" />
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
              </div>
              
              {isOwnComment && (
                <div className="relative">
                  <motion.button
                    onClick={() => setShowActions(!showActions)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full transition-colors"
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(0, 0, 0, 0.05)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RiMoreLine className="w-4 h-4" />
                  </motion.button>
                  
                  <AnimatePresence>
                    {showActions && !showConfirmDelete && (
                      <motion.div 
                        className="absolute right-0 top-8 bg-white rounded-xl shadow-lg py-1 z-10 min-w-[120px] border border-gray-100"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.1 }} // Reduced duration for faster animation
                      >
                        <button
                          onClick={handleEdit}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                        >
                          <FiEdit className="w-3.5 h-3.5 mr-2 text-indigo-500" />
                          {isEditing ? "Save" : "Edit"}
                        </button>
                        <button
                          onClick={handleDelete}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                        >
                          <FiTrash2 className="w-3.5 h-3.5 mr-2 text-red-500" />
                          Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Comment content */}
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-5 pb-3"
            >
              <div className="relative bg-gray-50 rounded-xl overflow-hidden">
                <textarea
                  ref={textareaRef}
                  value={newContent}
                  maxLength={100}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-3 border-none resize-none focus:ring-2 focus:ring-indigo-400 outline-none bg-gray-50 text-gray-700 rounded-xl"
                  rows={3}
                  placeholder="Edit your comment..."
                />
                <div className="flex justify-between items-center px-3 py-2 bg-gray-100">
                  <motion.div 
                    className="flex items-center text-xs"
                    animate={{ 
                      color: newContent.length > 90 ? "#ef4444" : "#6b7280"
                    }}
                  >
                    <FiMessageSquare className="mr-1 w-3 h-3" />
                    <span>{newContent.length}/100</span>
                  </motion.div>
                  <div className="flex gap-2">
                    <motion.button
                      onClick={handleEdit}
                      className="px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-full shadow-sm flex items-center gap-1"
                      whileHover={{ scale: 1.05, backgroundColor: "#4f46e5" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiSave className="w-3 h-3" />
                      <span>Save</span>
                    </motion.button>
                    <motion.button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded-full shadow-sm flex items-center gap-1"
                      whileHover={{ scale: 1.05, backgroundColor: "#e5e7eb" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiX className="w-3 h-3" />
                      <span>Cancel</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.p
                className="px-5 py-2 text-gray-700 leading-relaxed text-sm"
              >
                {comment.content}
              </motion.p>
              
              {/* Delete confirmation */}
              <AnimatePresence>
                {showConfirmDelete && (
                  <motion.div 
                    className="mx-5 my-2 p-3 bg-red-50 border border-red-100 rounded-xl"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.1 }} // Reduced duration for faster animation
                  >
                    <p className="text-sm text-red-600 mb-2">Are you sure you want to delete this comment?</p>
                    <div className="flex gap-2">
                      <motion.button
                        onClick={handleDelete}
                        className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-full shadow-sm flex items-center gap-1"
                        whileHover={{ scale: 1.05, backgroundColor: "#dc2626" }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiCheck className="w-3 h-3" />
                        <span>Delete</span>
                      </motion.button>
                      <motion.button
                        onClick={cancelDelete}
                        className="px-3 py-1.5 bg-white text-gray-700 text-xs font-medium rounded-full shadow-sm border border-gray-200 flex items-center gap-1"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiX className="w-3 h-3" />
                        <span>Cancel</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Like button */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                <motion.button
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                    userHasLiked 
                      ? 'bg-pink-50 text-pink-500 border border-pink-200' 
                      : 'text-gray-500 hover:bg-gray-50 border border-transparent'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {userHasLiked ? (
                    <RiHeartFill className="w-4 h-4" />
                  ) : (
                    <RiHeartLine className="w-4 h-4" />
                  )}
                  <span className="text-xs font-medium">
                    {comment.likes.length > 0 ? comment.likes.length : "Like"}
                  </span>
                </motion.button>
                
                {userHasLiked && (
                  <motion.div
                    className="text-xs text-gray-500"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    You liked this comment
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default CommentItem;
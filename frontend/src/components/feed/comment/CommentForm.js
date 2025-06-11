"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postComment } from '@/redux/comments/commentsSlice';
import { fetchUserDetails } from '@/redux/auth/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiSmile, FiX } from 'react-icons/fi';

const CommentForm = ({ postId }) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const { isLoggedIn, userDetails } = useSelector((state) => state.auth);
  const [isClient, setIsClient] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);
  const formRef = useRef(null);

  const maxCharacters = 250;

  useEffect(() => {
    setIsClient(true);
    if (isLoggedIn) {
      dispatch(fetchUserDetails());
    }
  }, [isLoggedIn, dispatch]);

  useEffect(() => {
    setCharacterCount(content.length);
  }, [content]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (content.trim()) {
      setIsSubmitting(true);

      const commentData = {
        post: postId,
        content: content.trim(),
      };

      dispatch(postComment(commentData));

      // Reset form
      setContent('');
      setShowEmojiPicker(false);
      setIsSubmitting(false);
    }
  };

  const addEmoji = (emoji) => {
    setContent(prev => prev + emoji);
    inputRef.current.focus();
  };

  const emojis = ['😊', '👍', '❤️', '🎉', '😂', '🤔', '👏', '🌟', '🔥', '✨', '🙌', '💯'];

  if (!isClient || !isLoggedIn) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.1 }} // Reduced duration for faster animation
      className="relative"
    >
      <div className="absolute -left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-300 to-transparent opacity-50"></div>
      
      <div className="flex flex-col">
        {/* Comment Input Container */}
        <form ref={formRef} onSubmit={handleSubmit} className="relative">
          <motion.div
            whileHover={{ boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
            animate={{ 
              boxShadow: isFocused 
                ? "0 10px 40px rgba(79, 70, 229, 0.15)" 
                : "0 4px 20px rgba(0,0,0,0.06)"
            }}
            className={`relative rounded-2xl transition-all duration-200 bg-white overflow-hidden`} // Reduced duration for faster animation
          >
            {/* User Avatar - Moved inside the form */}
            <div className="flex items-start p-4 gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative shrink-0"
              >
                <img
                  src={userDetails?.profilePicture || 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-indigo-100 shadow-sm"
                />
                <motion.div
                  className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.1 }} // Reduced duration for faster animation
                />
              </motion.div>
              
              <motion.textarea
                ref={inputRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                rows={1}
                placeholder="Add your thoughts..."
                maxLength={maxCharacters}
                className={`w-full py-2 bg-transparent focus:outline-none resize-none text-gray-700 text-base transition-all ${isFocused ? 'placeholder:text-indigo-300' : 'placeholder:text-gray-400'}`}
                initial={{ height: "40px" }}
                animate={{ height: content.length > 50 ? "80px" : "40px" }}
                transition={{ duration: 0.1 }} // Reduced duration for faster animation
              />
            </div>

            {/* Action Bar */}
            <motion.div 
              className={`flex items-center justify-between px-4 py-3 border-t ${isFocused ? 'border-indigo-100' : 'border-gray-50'} bg-gradient-to-b from-white to-gray-50`}
              animate={{ 
                backgroundColor: isFocused ? "#fafafa" : "#ffffff" 
              }}
              transition={{ duration: 0.1 }} // Reduced duration for faster animation
            >
              <div className="flex items-center space-x-2">
                {/* Emoji Button */}
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 rounded-full transition-colors flex items-center gap-1"
                >
                  <FiSmile className="w-4 h-4" />
                  <span className='text-sm'>Emoji</span>
                </motion.button>
              </div>

              <div className="flex items-center space-x-3">
                {/* Character Counter */}
                <AnimatePresence>
                  {characterCount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative"
                    >
                      <svg className="w-8 h-8">
                        <circle 
                          cx="16" 
                          cy="16" 
                          r="14" 
                          fill="none" 
                          stroke="#e5e7eb" 
                          strokeWidth="2" 
                        />
                        <motion.circle 
                          cx="16" 
                          cy="16" 
                          r="14" 
                          fill="none" 
                          stroke={characterCount > maxCharacters * 0.8
                            ? characterCount > maxCharacters * 0.95
                              ? "#ef4444"
                              : "#f59e0b"
                            : "#10b981"
                          } 
                          strokeWidth="2" 
                          strokeDasharray={88}
                          strokeDashoffset={88 - (88 * characterCount / maxCharacters)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                        {maxCharacters - characterCount}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={!content.trim() || isSubmitting}
                  className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${content.trim()
                    ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    } relative overflow-hidden`}
                >
                  {isSubmitting ? (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }} // Reduced duration for faster animation
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <FiSend className="w-4 h-4" />
                  )}
                  <span>{isSubmitting ? 'Sending' : 'Comment'}</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </form>

        {/* Emoji Picker */}
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", damping: 15 }} // Adjusted damping for faster animation
              className="mt-3 p-3 bg-white border border-gray-100 rounded-xl shadow-xl"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <FiSmile className="text-indigo-400" /> Quick Reactions
                </span>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowEmojiPicker(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                  <FiX className="w-4 h-4" />
                </motion.button>
              </div>
              <motion.div 
                className="grid grid-cols-6 sm:grid-cols-12 gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.02 }} // Reduced stagger duration for faster animation
              >
                {emojis.map((emoji, index) => (
                  <motion.button
                    key={emoji}
                    type="button"
                    onClick={() => addEmoji(emoji)}
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }} // Reduced delay for faster animation
                    className="text-2xl p-1.5 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    {emoji}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CommentForm;
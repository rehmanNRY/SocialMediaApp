"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postComment } from '@/redux/comments/commentsSlice';
import { fetchUserDetails } from '@/redux/auth/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiSmile, FiFeather, FiCheck, FiX, FiMessageSquare } from 'react-icons/fi';

const CommentForm = ({ postId }) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const { isLoggedIn, userDetails } = useSelector((state) => state.auth);
  const [isClient, setIsClient] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessIndicator, setShowSuccessIndicator] = useState(false);
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

      await dispatch(postComment(commentData));
      
      // Show success indicator
      setShowSuccessIndicator(true);
      setTimeout(() => {
        setShowSuccessIndicator(false);
        // Reset form
        setContent('');
        setShowEmojiPicker(false);
        setIsSubmitting(false);
      }, 1000);
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
      transition={{ duration: 0.3, type: "spring", damping: 25 }}
      className="mb-6 bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all"
    >
      <div className="flex items-start space-x-4">
        {/* User Avatar */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <img
            src={userDetails?.profilePicture || '/default-avatar.png'}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100 shadow-sm ring-2 ring-indigo-50"
          />
          <motion.div 
            className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          />
        </motion.div>

        {/* Comment Input Container */}
        <div className="flex-1">
          <form ref={formRef} onSubmit={handleSubmit} className="relative">
            <motion.div 
              whileHover={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
              className={`relative border ${isFocused ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-gray-200'} 
              rounded-xl transition-all duration-200 bg-gray-50 overflow-hidden shadow-sm`}
            >
              <div className="flex items-center px-4 py-2 mt-2 border-b border-gray-100">
                <FiFeather className="text-indigo-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Your Thoughts</span>
              </div>
              
              <motion.textarea
                ref={inputRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                rows={2}
                placeholder="Share your thoughts on this post..."
                maxLength={maxCharacters}
                className="w-full py-3 px-4 bg-transparent focus:outline-none resize-none text-gray-700"
                initial={{ height: "50px" }}
                animate={{ height: content.length > 100 ? "70px" : "50px" }}
              />

              {/* Action Bar */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 bg-white/50">
                <div className="flex items-center space-x-3">                  
                  {/* Emoji Picker Toggle */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1, backgroundColor: "#eef2ff" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 rounded-full transition-colors flex items-center gap-1"
                  >
                    <FiSmile className="w-4 h-4" />
                    <span className="text-xs font-medium hidden sm:inline">Emoji</span>
                  </motion.button>
                </div>
                
                {/* Character Counter and Submit */}
                <div className="flex items-center space-x-3">
                  <AnimatePresence>
                    {characterCount > 0 && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          characterCount > maxCharacters * 0.8 
                            ? characterCount > maxCharacters * 0.95 
                              ? 'bg-red-100 text-red-600' 
                              : 'bg-yellow-100 text-yellow-600' 
                            : 'bg-green-100 text-green-600'
                        }`}
                      >
                        {characterCount}/{maxCharacters}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03, backgroundColor: content.trim() ? "#4338ca" : "" }}
                    whileTap={{ scale: 0.97 }}
                    disabled={!content.trim() || isSubmitting}
                    className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 shadow-md text-sm ${
                      content.trim()
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    } relative overflow-hidden`}
                  >
                    {showSuccessIndicator ? (
                      <>
                        <FiCheck className="w-4 h-4" />
                        <span>Posted!</span>
                      </>
                    ) : (
                      <>
                        <FiSend className="w-4 h-4" />
                        <span className="hidden sm:inline">{isSubmitting ? 'Posting...' : 'Post Comment'}</span>
                      </>
                    )}
                    {isSubmitting && (
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1 }}
                        className="absolute bottom-0 left-0 h-1 bg-white/30"
                      />
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </form>

          {/* Emoji Picker */}
          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", damping: 25 }}
                className="mt-3 p-4 bg-white border border-gray-200 rounded-xl shadow-lg"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Quick Reactions</span>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowEmojiPicker(false)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full"
                  >
                    <FiX className="w-4 h-4" />
                  </motion.button>
                </div>
                <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
                  {emojis.map((emoji) => (
                    <motion.button
                      key={emoji}
                      type="button"
                      onClick={() => addEmoji(emoji)}
                      whileHover={{ scale: 1.2, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-2xl p-1.5 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default CommentForm;
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postComment } from '@/redux/comments/commentsSlice';
import { fetchUserDetails } from '@/redux/auth/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiSmile, FiImage, FiX, FiPaperclip } from 'react-icons/fi';

const CommentForm = ({ postId }) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const { isLoggedIn, userDetails } = useSelector((state) => state.auth);
  const [isClient, setIsClient] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      const commentData = {
        post: postId,
        content: content.trim(),
      };

      dispatch(postComment(commentData));
      
      // Reset form
      setContent('');
      setShowEmojiPicker(false);
      
      // Add success animation
      if (formRef.current) {
        formRef.current.classList.add('success-pulse');
        setTimeout(() => {
          formRef.current?.classList.remove('success-pulse');
        }, 1000);
      }
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
      transition={{ duration: 0.3 }}
      className="mb-6 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start space-x-3">
        {/* User Avatar */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative"
        >
          <img
            src={userDetails?.profilePicture}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100 shadow-sm"
          />
          <motion.div 
            className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          />
        </motion.div>

        {/* Comment Input Container */}
        <div className="flex-1">
          <form ref={formRef} onSubmit={handleSubmit} className="relative">
            <div 
              className={`relative border ${isFocused ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-gray-200'} 
              rounded-xl transition-all duration-200 bg-gray-50 overflow-hidden`}
            >
              <motion.textarea
                ref={inputRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                rows={1}
                placeholder="Share your thoughts..."
                maxLength={maxCharacters}
                className="w-full py-3 px-4 bg-transparent focus:outline-none resize-none"
              />

              {/* Action Bar */}
              <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100">
                <div className="flex items-center space-x-2">                  
                  {/* Emoji Picker Toggle */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-1.5 text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 rounded-full transition-colors"
                  >
                    <FiSmile className="w-5 h-5" />
                  </motion.button>
                </div>
                
                {/* Character Counter and Submit */}
                <div className="flex items-center space-x-2">
                  <AnimatePresence>
                    {characterCount > 0 && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className={`text-xs font-medium ${
                          characterCount > maxCharacters * 0.8 
                            ? characterCount > maxCharacters * 0.95 
                              ? 'text-red-500' 
                              : 'text-amber-500' 
                            : 'text-gray-400'
                        }`}
                      >
                        {characterCount}/{maxCharacters}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
                      content.trim()
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md hover:shadow-lg'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center space-x-1">
                      <span className="hidden sm:inline">Post</span>
                      <FiSend className="w-4 h-4" />
                    </div>
                  </motion.button>
                </div>
              </div>
            </div>
          </form>

          {/* Emoji Picker */}
          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-2 p-3 bg-white border border-gray-200 rounded-xl shadow-lg"
              >
                <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
                  {emojis.map((emoji) => (
                    <motion.button
                      key={emoji}
                      type="button"
                      onClick={() => addEmoji(emoji)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-2xl p-1 hover:bg-gray-100 rounded-lg transition-colors"
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
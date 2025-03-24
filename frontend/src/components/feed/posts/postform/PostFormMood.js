import React from 'react';
import { AiFillHeart, AiOutlineCloseCircle, AiOutlineHeart } from 'react-icons/ai';
import { motion } from 'framer-motion';

const PostFormMood = ({ mood, setMood }) => {
  if (!mood) return null;
  
  // Split the mood to separate emoji and text if present
  const moodParts = mood.split(' ');
  const emoji = moodParts[0];
  const text = moodParts.slice(1).join(' ');
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3 flex items-center"
    >
      <span className="text-sm font-medium text-indigo-600 flex items-center mr-2">
        <AiFillHeart className="mr-1 text-pink-500" />
        Feeling:
      </span>
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="text-sm bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-1.5 rounded-full shadow-sm border border-indigo-100 flex items-center"
      >
        <span className="mr-1">{emoji}</span>
        {text && <span className="font-medium text-gray-700">{text}</span>}
        <motion.button
          type="button"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className="ml-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
          onClick={() => setMood('')}
          aria-label="Remove mood"
        >
          <AiOutlineCloseCircle className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default PostFormMood;
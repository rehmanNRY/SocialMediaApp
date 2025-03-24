// InteractionButtons.js
"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  FiMessageSquare,
  FiHeart,
  FiBookmark,
  FiShare2,
  FiMoreHorizontal,
} from "react-icons/fi";

const InteractionButtons = ({
  userHasLiked,
  likersCount,
  showComments,
  isUserBookmark,
  onToggleLike,
  onToggleComments,
  onSharePost,
  onToggleBookmark,
  onShowLikers,
  likers,
}) => {
  return (
    <>
      <div
        className="flex items-center space-x-2 mb-2 cursor-pointer"
        onClick={onShowLikers}
      >
        {likers.slice(0, 3).map((liker) => (
          <img
            key={liker._id}
            src={liker.profilePicture}
            alt={liker.fullName}
            className="w-8 h-8 sm:w-6 sm:h-6 rounded-full shadow-sm transition-transform transform hover:scale-110 object-cover"
          />
        ))}
        {likers.length > 0 && (
          <span className="text-sm text-gray-600 hover:text-gray-800 transition">
            Liked by <strong>{likers.length}</strong>
          </span>
        )}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-between items-center pt-2 pb-1 border-t border-gray-100 mt-3"
      >
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleLike}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 ${userHasLiked
                ? "text-rose-600 bg-rose-50"
                : "text-gray-600 hover:bg-gray-100"
              } transition-all`}
          >
            <FiHeart className={`w-4 h-4 ${userHasLiked ? "fill-rose-600" : ""}`} />
            <span className="text-sm font-medium">{likersCount}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleComments}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 ${showComments
                ? "text-indigo-600 bg-indigo-50"
                : "text-gray-600 hover:bg-gray-100"
              } transition-all`}
          >
            <FiMessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium">Comments</span>
          </motion.button>
        </div>

        <div className="flex items-center space-x-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onSharePost}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiShare2 className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleBookmark}
            className={`p-2 rounded-full transition-colors ${isUserBookmark
                ? "text-indigo-600"
                : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            <FiBookmark className={`w-4 h-4 ${isUserBookmark ? "fill-indigo-600" : ""}`} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onShowLikers}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiMoreHorizontal className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default InteractionButtons;
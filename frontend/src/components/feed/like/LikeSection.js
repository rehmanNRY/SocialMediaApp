"use client";
import React, { useEffect, useState } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import { FiBookmark, FiShare2 } from "react-icons/fi";
import { BsFillBookmarkFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { getCommentsByPost } from "@/redux/comments/commentsSlice";
import { motion, AnimatePresence } from "framer-motion";

const LikeSection = ({
  userHasLiked,
  handleToggleLike,
  post,
  handleShowLikers,
  likers,
  isUserBookmark,
  handleToggleBookmark,
}) => {
  const dispatch = useDispatch();
  const { commentsByPostId } = useSelector((state) => state.comments);
  const comments = commentsByPostId[post._id] || [];
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    if (post._id) {
      dispatch(getCommentsByPost(post._id));
    }
  }, [dispatch, post._id]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  const counterVariants = {
    initial: { scale: 1 },
    animate: { scale: [1, 1.25, 1], transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      className="bg-white pb-4 px-4 rounded-b-lg shadow-sm"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Engagement Stats */}
      <AnimatePresence>
        {(likers.length > 0 || comments.length > 0) && (
          <motion.div 
            className="flex items-center justify-between py-3 border-b border-gray-100"
            variants={itemVariants}
          >
            {/* Likers Section */}
            <motion.div
              className="flex items-center space-x-2 cursor-pointer group"
              onClick={handleShowLikers}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex -space-x-2">
                {likers.slice(0, 3).map((liker, index) => (
                  <motion.img
                    key={liker._id}
                    src={liker.profilePicture}
                    alt={liker.fullName}
                    className="w-7 h-7 rounded-full border-2 border-white shadow-sm object-cover"
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2, zIndex: 10 }}
                  />
                ))}
                {likers.length > 3 && (
                  <motion.div 
                    className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium border-2 border-white"
                    whileHover={{ y: -2, zIndex: 10 }}
                  >
                    +{likers.length - 3}
                  </motion.div>
                )}
              </div>
              {likers.length > 0 && (
                <motion.span 
                  className="text-sm text-gray-600 group-hover:text-blue-500 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="font-medium">{likers.length}</span> {likers.length === 1 ? 'person' : 'people'} liked this
                </motion.span>
              )}
            </motion.div>

            {/* Comments Count */}
            {comments.length > 0 && (
              <motion.div 
                className="text-sm text-gray-600 flex items-center"
                variants={itemVariants}
              >
                <BiCommentDetail className="mr-1" />
                <span>{comments.length} comment{comments.length !== 1 ? 's' : ''}</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons Section */}
      <motion.div 
        className="flex justify-between items-center py-2 mt-1"
        variants={itemVariants}
      >
        {/* Like Button */}
        <motion.button
          onClick={handleToggleLike}
          className={`flex items-center justify-center space-x-1.5 py-2 px-4 rounded-full transition-colors ${
            userHasLiked 
              ? "text-blue-600 bg-blue-50 hover:bg-blue-100" 
              : "text-gray-700 hover:bg-gray-100"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            initial={false}
            animate={userHasLiked ? { y: [0, -5, 0] } : {}}
            transition={{ duration: 0.3 }}
          >
            {userHasLiked ? (
              <AiFillLike className="text-xl" />
            ) : (
              <AiOutlineLike className="text-xl" />
            )}
          </motion.div>
          <motion.span 
            className="font-medium"
            animate={userHasLiked ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {userHasLiked ? "Liked" : "Like"}
          </motion.span>
          {post.likes.length > 0 && (
            <motion.span 
              className="text-xs font-semibold rounded-full px-2 py-0.5 bg-blue-100 text-blue-800 ml-1"
              variants={counterVariants}
              initial="initial"
              animate={activeTab === 'like' ? 'animate' : 'initial'}
              key={post.likes.length}
            >
              {post.likes.length}
            </motion.span>
          )}
        </motion.button>

        {/* Comment Button */}
        <motion.button 
          className="flex items-center justify-center space-x-1.5 py-2 px-4 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onHoverStart={() => setActiveTab('comment')}
          onHoverEnd={() => setActiveTab(null)}
        >
          <BiCommentDetail className="text-xl" />
          <span className="font-medium">Comment</span>
          {comments.length > 0 && (
            <motion.span 
              className="text-xs font-semibold rounded-full px-2 py-0.5 bg-gray-100 text-gray-800 ml-1"
              variants={counterVariants}
              initial="initial"
              animate={activeTab === 'comment' ? 'animate' : 'initial'}
              key={comments.length}
            >
              {comments.length}
            </motion.span>
          )}
        </motion.button>

        {/* Bookmark Button */}
        <motion.button
          onClick={handleToggleBookmark}
          className={`flex items-center justify-center space-x-1.5 py-2 px-4 rounded-full transition-colors ${
            isUserBookmark 
              ? "text-purple-600 bg-purple-50 hover:bg-purple-100" 
              : "text-gray-700 hover:bg-gray-100"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onHoverStart={() => setActiveTab('bookmark')}
          onHoverEnd={() => setActiveTab(null)}
          aria-label={isUserBookmark ? "Remove bookmark" : "Add bookmark"}
        >
          <motion.div
            initial={false}
            animate={isUserBookmark ? { y: [0, -5, 0] } : {}}
            transition={{ duration: 0.3 }}
          >
            {isUserBookmark ? (
              <BsFillBookmarkFill className="text-lg" />
            ) : (
              <FiBookmark className="text-lg" />
            )}
          </motion.div>
          <motion.span 
            className="font-medium"
            animate={isUserBookmark ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {isUserBookmark ? "Saved" : "Save"}
          </motion.span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default LikeSection;
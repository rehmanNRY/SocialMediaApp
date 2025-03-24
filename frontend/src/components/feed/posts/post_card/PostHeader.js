// components/post/PostHeader.js
"use client";
import React, { useState } from "react";
import { FiEdit, FiTrash2, FiClock, FiMoreVertical, FiHeart, FiMessageCircle } from "react-icons/fi";
import Link from "next/link";
import { timeAgo } from "@/utility/timeAgo";
import { ConfirmModal } from "@/components/";
import { motion, AnimatePresence } from "framer-motion";

const PostHeader = ({
  post,
  userDetails,
  isEditing,
  onEditClick,
  onDeleteClick
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setShowActionsMenu(false);
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    onDeleteClick();
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const toggleActionsMenu = () => {
    setShowActionsMenu(!showActionsMenu);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-4"
      >
        <div className="flex justify-between mb-3">
          {/* User Info Section */}
          <Link href={`/profile/${post.user?._id}`} className="group flex items-start flex-1">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <img
                src={post.user?.profilePicture}
                alt={post.user?.fullName}
                className="w-12 h-12 rounded-full mr-3 object-cover border-2 border-white shadow-sm group-hover:shadow-md transition-all"
              />
              {post.user?.isVerified && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -bottom-1 -right-1 bg-indigo-500 rounded-full p-0.5 border-2 border-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              )}
            </motion.div>

            <div className="flex-1">
              <div className="flex items-center flex-wrap">
                <motion.h4
                  className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors"
                  whileHover={{ scale: 1.01 }}
                >
                  <span className="capitalize">
                    {post.user?.fullName}
                  </span>
                </motion.h4>
                <motion.span
                  whileHover={{ backgroundColor: "#e0e7ff" }}
                  className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full flex items-center font-normal transition-colors"
                >
                  @{post.user?.username.toLowerCase()}
                </motion.span>
              </div>

              <div className="flex items-center flex-wrap mt-1">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center text-gray-500 text-xs"
                >
                  <FiClock className="w-3 h-3 mr-1" />
                  <span>{timeAgo(post.createdAt)}</span>
                </motion.div>

                {post.feeling && (
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="ml-2 bg-fuchsia-50 border border-fuchsia-200 rounded-full px-2 py-0.5 text-xs text-fuchsia-600"
                  >
                    {post.feeling}
                  </motion.span>
                )}
              </div>
            </div>
          </Link>

          {/* Post Actions Section */}
          {userDetails?._id === post.user._id && (
            <div className="relative flex items-start">
              {isEditing ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onEditClick}
                  className="bg-indigo-600 text-white px-4 py-1.5 rounded-full shadow-md hover:bg-indigo-700 transition duration-200 flex items-center space-x-1.5 text-sm"
                >
                  <FiEdit className="w-3.5 h-3.5" />
                  <span>Save</span>
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleActionsMenu}
                  className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <FiMoreVertical className="w-5 h-5" />
                </motion.button>
              )}

              {/* Dropdown Menu */}
              <AnimatePresence>
                {showActionsMenu && !isEditing && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-10 w-40 bg-white rounded-lg shadow-lg overflow-hidden z-10 border border-gray-100"
                  >
                    <motion.button
                      onClick={() => {
                        onEditClick();
                        setShowActionsMenu(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:text-indigo-600 flex items-center hover:bg-[#f3f4f6]"
                    >
                      <FiEdit className="w-4 h-4 mr-2" />
                      <span>Edit post</span>
                    </motion.button>
                    <motion.button
                      onClick={handleDeleteClick}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:text-red-600 flex items-center hover:bg-[#f3f4f6]"
                    >
                      <FiTrash2 className="w-4 h-4 mr-2" />
                      <span>Delete post</span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Engagement Stats - Optional */}
        {post.engagementStats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center space-x-4 text-xs text-gray-500 ml-14 mb-1"
          >
            <div className="flex items-center">
              <FiHeart className="w-3.5 h-3.5 mr-1.5 text-rose-500" />
              <span>{post.engagementStats.likes} likes</span>
            </div>
            <div className="flex items-center">
              <FiMessageCircle className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
              <span>{post.engagementStats.comments} comments</span>
            </div>
          </motion.div>
        )}

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.2 }}
          className="ml-14 h-px bg-gray-100 mt-2"
        />
      </motion.div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
      />
    </>
  );
};

export default PostHeader;
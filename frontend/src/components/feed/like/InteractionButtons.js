// InteractionButtons.js
"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiMessageSquare,
  FiHeart,
  FiBookmark,
  FiShare2,
  FiMoreHorizontal,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { getCommentsByPost } from "@/redux/comments/commentsSlice";
import { fetchSavedItems, toggleSavedItem } from "@/redux/savedItems/savedItemsSlice";
import { getPostLikers, toggleLikePost } from "@/redux/posts/postsSlice";
import LikersModal from "./LikersModal";

const InteractionButtons = ({
  post,
  userDetails,
  showComments,
  onToggleComments,
}) => {
  const dispatch = useDispatch();

  // State management
  const [likers, setLikers] = useState([]);
  const [showLikersModal, setShowLikersModal] = useState(false);
  const [optimisticLiked, setOptimisticLiked] = useState(false);
  const [optimisticBookmarked, setOptimisticBookmarked] = useState(false);

  // Redux selectors
  const { commentsByPostId } = useSelector((state) => state.comments);
  const { savedItems } = useSelector((state) => state.savedItems);
  const comments = commentsByPostId[post._id] || [];

  // ===== Event Handlers =====

  // Bookmark handling
  const handleToggleBookmark = () => {
    // Optimistically update UI
    setOptimisticBookmarked(!optimisticBookmarked);

    // Dispatch the action and handle the result
    dispatch(toggleSavedItem(post._id))
      .unwrap()
      .catch((error) => {
        // If there was an error, revert the optimistic update
        // setOptimisticBookmarked(optimisticBookmarked);
        console.error("Error toggling bookmark:", error);
      });
  };

  // Like handling
  const handleToggleLike = () => {
    // Optimistically update UI
    const wasLiked = likers.some((liker) => liker._id === userDetails?._id);

    // Update optimistic state
    setOptimisticLiked(!wasLiked);

    // If user was in likers, remove them; otherwise add them
    let updatedLikers = [...likers];
    if (wasLiked) {
      updatedLikers = updatedLikers.filter(liker => liker._id !== userDetails?._id);
    } else if (userDetails) {
      updatedLikers.push(userDetails);
    }
    setLikers(updatedLikers);

    // Make the actual API call
    dispatch(toggleLikePost(post._id)).then(() => {
      // Refresh the list of likers after liking or unliking the post
      dispatch(getPostLikers(post._id)).then((action) => {
        if (action.payload?.data) {
          setLikers(action.payload.data);
        }
      });
    });
  };

  // Likers modal handling
  const handleShowLikers = () => {
    setShowLikersModal(true);
  };

  const closeModal = () => {
    setShowLikersModal(false);
  };

  // Share post functionality
  const handleSharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: `Post by ${post.user?.fullName}`,
        text: post.content?.substring(0, 100) + '...',
        url: window.location.origin + '/posts/' + post._id,
      });
    } else {
      // Fallback for browsers that don't support share API
      navigator.clipboard.writeText(window.location.origin + '/posts/' + post._id);
      // Could show a toast notification here
    }
  };

  // ===== Effects =====

  // Fetch saved items on component mount
  useEffect(() => {
    dispatch(fetchSavedItems());
  }, [dispatch]);

  // Update bookmark state when savedItems changes
  useEffect(() => {
    const isBookmarked = savedItems.some((item) => item.post?._id === post._id);
    setOptimisticBookmarked(isBookmarked);
  }, [savedItems, post._id]);

  // Fetch post likers
  useEffect(() => {
    if (!post?._id) return;
    dispatch(getPostLikers(post._id)).then((action) => {
      if (action.payload?.data) {
        // Deduplicate likers by _id to prevent duplicate keys
        const uniqueLikers = action.payload.data.filter((liker, index, self) => 
          index === self.findIndex(l => l._id === liker._id)
        );
        setLikers(uniqueLikers);
      }
    });
  }, [dispatch, post._id]);

  // Set initial like state based on actual state
  useEffect(() => {
    setOptimisticLiked(likers.some((liker) => liker._id === userDetails?._id));
  }, [likers, userDetails]);

  // Fetch comments for this post
  useEffect(() => {
    if (!post?._id) return;
    dispatch(getCommentsByPost(post._id));
  }, [dispatch, post._id]);

  return (
    <>
      {/* Likers preview */}
      {likers.length > 0 && (
        <div
          className="flex items-center space-x-1.5 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-all"
          onClick={handleShowLikers}
        >
          <div className="flex -space-x-3">
            {likers.slice(0, 3).map((liker, index) => (
              <img
                key={`${liker._id}-${index}`}
                src={liker.profilePicture}
                alt={liker.fullName}
                className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-md"
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 hover:text-gray-800 transition">
            Liked by <strong>{likers.length}</strong> people
          </span>
        </div>
      )}

      {/* Likers modal */}
      {showLikersModal && <LikersModal likers={likers} closeModal={closeModal} />}

      {/* Interaction buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-between items-center pt-2 pb-1 border-t border-gray-100 mt-2"
      >
        {/* Left side buttons */}
        <div className="flex items-center space-x-2">
          {/* Like button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleLike}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 ${optimisticLiked
              ? "text-rose-600 bg-rose-50"
              : "text-gray-600 hover:bg-gray-100"
              } transition-all`}
          >
            <FiHeart className={`w-4 h-4 ${optimisticLiked ? "fill-rose-600" : ""}`} />
            <span className="text-sm font-medium">{likers.length}</span>
          </motion.button>

          {/* Comment button */}
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
            <span className="text-sm font-medium">{comments.length} Comments</span>
          </motion.button>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center space-x-1">
          {/* Share button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSharePost}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiShare2 className="w-4 h-4" />
          </motion.button>

          {/* Bookmark button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleBookmark}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 ${optimisticBookmarked
              ? "text-fuchsia-600 bg-fuchsia-50"
              : "text-gray-600 hover:bg-gray-100"
              } transition-all`}
          >
            <FiBookmark className={`w-4 h-4 ${optimisticBookmarked ? "fill-fuchsia-600" : ""}`} />
            <span className="text-sm font-medium">{optimisticBookmarked ? "Bookmarked" : "Bookmark"}</span>
          </motion.button>

          {/* More options button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleShowLikers}
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
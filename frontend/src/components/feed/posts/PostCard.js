// PostCard.js
"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMoreHorizontal,
  FiMessageSquare,
  FiHeart,
  FiBookmark,
  FiShare2,
  FiImage,
  FiChevronDown,
  FiChevronUp
} from "react-icons/fi";
import CommentForm from "../comment/CommentForm";
import CommentList from "../comment/CommentList";
import LikersModal from "../like/LikersModal";
import InteractionButtons from "../like/InteractionButtons";
import { formatText } from "@/utility/textFormatter";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "@/redux/auth/authSlice";
import {
  deletePost,
  editPost,
  toggleLikePost,
  getPostLikers,
} from "@/redux/posts/postsSlice";
import { fetchSavedItems, toggleSavedItem } from "@/redux/savedItems/savedItemsSlice";
import { useRouter } from "next/navigation";
import { PollSection, PostHeader, EditPostModal } from "./post_card";
import { patternStyles } from "@/constants";

const PostCard = ({ post }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editBackgroundColor, setEditBackgroundColor] = useState(post.backgroundColor || 'bg-white');
  const [likers, setLikers] = useState([]);
  const [showLikersModal, setShowLikersModal] = useState(false);
  const [optimisticLiked, setOptimisticLiked] = useState(false);
  const [optimisticBookmarked, setOptimisticBookmarked] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const { isLoggedIn, userDetails } = useSelector((state) => state.auth);
  const { savedItems } = useSelector((state) => state.savedItems);

  // Animate card on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchUserDetails());
    }
  }, [isLoggedIn, dispatch]);

  useEffect(() => {
    if (post._id) {
      dispatch(getPostLikers(post._id)).then((action) => {
        if (action.payload?.data) {
          setLikers(action.payload.data);
        }
      });
    }
  }, [dispatch, post._id]);

  // Set initial optimistic state based on actual state
  useEffect(() => {
    setOptimisticLiked(likers.some((liker) => liker._id === userDetails?._id));
  }, [likers, userDetails]);

  const handleEditClick = () => {
    // Reset edit state to current post values
    setEditContent(post.content);
    setEditBackgroundColor(post.backgroundColor || 'bg-white');
    setShowEditModal(true);
  };

  const handleSaveEdit = (newContent, newBackgroundColor) => {
    dispatch(editPost({
      postId: post._id,
      content: newContent,
      backgroundColor: newBackgroundColor
    }));
    setEditContent(newContent);
    setEditBackgroundColor(newBackgroundColor);
  };

  const handleDeletePost = () => {
    // Animate out before deleting
    setIsVisible(false);
    setTimeout(() => {
      dispatch(deletePost(post._id));
    }, 300);
  };

  const handleToggleLike = () => {
    if (!isLoggedIn) {
      // Maybe show a login prompt
      return;
    }

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

  const handleShowLikers = () => {
    setShowLikersModal(true);
  };

  const closeModal = () => {
    setShowLikersModal(false);
  };

  useEffect(() => {
    dispatch(fetchSavedItems());
  }, [dispatch]);

  useEffect(() => {
    setOptimisticBookmarked(savedItems.some((item) => item.post?._id === post._id));
  }, [savedItems, post._id]);

  const handleToggleBookmark = () => {
    if (!isLoggedIn) {
      // Maybe show a login prompt
      return;
    }

    // Optimistically update UI
    setOptimisticBookmarked(!optimisticBookmarked);

    // Dispatch the action and handle the result
    dispatch(toggleSavedItem(post._id))
      .unwrap()
      .then((result) => {
        // The result contains the correct isSaved state from the server
        // We don't need to do anything here as the Redux store will be updated
      })
      .catch((error) => {
        // If there was an error, revert the optimistic update
        setOptimisticBookmarked(optimisticBookmarked);
        console.error("Error toggling bookmark:", error);
      });
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  // Use optimistic state for UI
  const userHasLiked = optimisticLiked;
  const isUserBookmark = optimisticBookmarked;

  // Format content with hashtags
  const formatContentWithHashtags = (content) => {
    if (!content) return '';

    return content.replace(/#(\w+)/g, '<span class="text-indigo-600 font-medium cursor-pointer hover:underline" data-hashtag="$1">#$1</span>');
  };

  // Handle hashtag click
  const handleHashtagClick = (e) => {
    if (e.target.hasAttribute('data-hashtag')) {
      const hashtag = e.target.getAttribute('data-hashtag');
      router.push(`/hashtag/${hashtag}`);
    }
  };

  // Check if content has more than 10 lines
  const hasLongContent = () => {
    if (!post.content) return false;
    return post.content.split('\n').length > 10;
  };

  // Get truncated content (first 7 lines)
  const getTruncatedContent = () => {
    if (!post.content) return '';
    const lines = post.content.split('\n');
    return lines.slice(0, 7).join('\n');
  };

  // Share post functionality
  const handleSharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: `Post by ${post.user?.fullName}`,
        text: post.content?.substring(0, 100) + '...',
        url: window.location.origin + '/post/' + post._id,
      });
    } else {
      // Fallback for browsers that don't support share API
      navigator.clipboard.writeText(window.location.origin + '/post/' + post._id);
      // Could show a toast notification here
    }
  };

  // Card variants for animation
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      initial="hidden"
      animate={isVisible ? "visible" : "exit"}
      exit="exit"
      variants={cardVariants}
      className={`${post.backgroundColor || 'bg-white'} rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all`}
      style={post.backgroundColor?.includes('pattern-') ? patternStyles[post.backgroundColor.split(' ').find(cls => cls.startsWith('pattern-'))] : {}}
    >
      <div className="p-5">
        <PostHeader
          post={post}
          userDetails={userDetails}
          isEditing={false}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeletePost}
        />

        {/* Post content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-4 text-gray-800 leading-relaxed"
        >
          {hasLongContent() && !showFullContent ? (
            <>
              <div
                onClick={handleHashtagClick}
                className="prose prose-indigo max-w-none"
                dangerouslySetInnerHTML={{ __html: formatText(formatContentWithHashtags(getTruncatedContent())) }}
              ></div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFullContent(true)}
                className="mt-2 flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                <span>Show more</span>
                <FiChevronDown className="w-4 h-4" />
              </motion.button>
            </>
          ) : hasLongContent() && showFullContent ? (
            <>
              <div
                onClick={handleHashtagClick}
                className="prose prose-indigo max-w-none"
                dangerouslySetInnerHTML={{ __html: formatText(formatContentWithHashtags(post.content)) }}
              ></div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFullContent(false)}
                className="mt-2 flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                <span>Show less</span>
                <FiChevronUp className="w-4 h-4" />
              </motion.button>
            </>
          ) : (
            <div
              onClick={handleHashtagClick}
              className="prose prose-indigo max-w-none"
              dangerouslySetInnerHTML={{ __html: formatText(formatContentWithHashtags(post.content)) }}
            ></div>
          )}
        </motion.div>

        {/* Post image with animation */}
        {post.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="relative rounded-lg overflow-hidden mb-4 group"
          >
            <img
              src={post.image}
              alt="Post"
              className="w-full rounded-lg object-cover max-h-[24rem] transform transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-3 right-3 bg-black/60 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <FiImage className="w-4 h-4" />
            </div>
          </motion.div>
        )}

        {/* Poll display */}
        {post.poll && <PollSection post={post} isLoggedIn={isLoggedIn} userDetails={userDetails} />}

        {/* Interaction buttons */}
        <InteractionButtons
          userHasLiked={userHasLiked}
          likers={likers}
          likersCount={likers.length}
          showComments={showComments}
          isUserBookmark={isUserBookmark}
          onToggleLike={handleToggleLike}
          onToggleComments={handleToggleComments}
          onSharePost={handleSharePost}
          onToggleBookmark={handleToggleBookmark}
          onShowLikers={handleShowLikers}
        />
      </div>

      {/* Comments section with animation */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-100 bg-gray-50 overflow-hidden"
          >
            <div className="p-5">
              <CommentForm postId={post._id} />
              <CommentList postId={post._id} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showLikersModal && <LikersModal likers={likers} closeModal={closeModal} />}

      {/* Edit Post Modal */}
      <EditPostModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        post={post}
        onSave={handleSaveEdit}
      />
    </motion.div>
  );
};

export default PostCard;
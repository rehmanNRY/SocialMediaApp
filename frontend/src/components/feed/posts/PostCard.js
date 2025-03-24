// PostCard.js
"use client";
import React, { useEffect, useState } from "react";
import CommentForm from "../comment/CommentForm";
import CommentList from "../comment/CommentList";
import LikersModal from "../like/LikersModal";
import LikeSection from "../like/LikeSection";
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

  const dispatch = useDispatch();
  const router = useRouter();

  const { isLoggedIn, userDetails } = useSelector((state) => state.auth);
  const { savedItems } = useSelector((state) => state.savedItems);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchUserDetails());
    }
  }, [isLoggedIn, dispatch]);

  useEffect(() => {
    if (post._id) {
      dispatch(getPostLikers(post._id)).then((action) => {
        setLikers(action.payload.data);
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
    dispatch(deletePost(post._id));
  };

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
        setLikers(action.payload.data);
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
    setOptimisticBookmarked(savedItems.some((item) => item.post._id === post._id));
  }, [savedItems, post._id]);

  const handleToggleBookmark = () => {
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

  // Use optimistic state for UI
  const userHasLiked = optimisticLiked;
  const isUserBookmark = optimisticBookmarked;

  // Format content with hashtags
  const formatContentWithHashtags = (content) => {
    if (!content) return '';

    return content.replace(/#(\w+)/g, '<span class="text-indigo-600 cursor-pointer" data-hashtag="$1">#$1</span>');
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

  return (
    <div className={`${post.backgroundColor || 'bg-white'} p-6 rounded-xl shadow-md relative hover:shadow-xl transition-shadow duration-300`}
      style={post.backgroundColor?.includes('pattern-') ? patternStyles[post.backgroundColor.split(' ').find(cls => cls.startsWith('pattern-'))] : {}}
    >
      <PostHeader
        post={post}
        userDetails={userDetails}
        isEditing={false}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeletePost}
      />

      <div className="mb-4 text-gray-800">
        {hasLongContent() && !showFullContent ? (
          <>
            <div
              onClick={handleHashtagClick}
              dangerouslySetInnerHTML={{ __html: formatText(formatContentWithHashtags(getTruncatedContent())) }}
            ></div>
            <button
              onClick={() => setShowFullContent(true)}
              className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              Show more
            </button>
          </>
        ) : hasLongContent() && showFullContent ? (
          <>
            <div
              onClick={handleHashtagClick}
              dangerouslySetInnerHTML={{ __html: formatText(formatContentWithHashtags(post.content)) }}
            ></div>
            <button
              onClick={() => setShowFullContent(false)}
              className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              Show less
            </button>
          </>
        ) : (
          <div
            onClick={handleHashtagClick}
            dangerouslySetInnerHTML={{ __html: formatText(formatContentWithHashtags(post.content)) }}
          ></div>
        )}
      </div>

      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="w-full rounded-lg mb-4 object-cover max-h-[22rem]"
        />
      )}

      {/* Poll display */}
      {post.poll && <PollSection post={post} isLoggedIn={isLoggedIn} userDetails={userDetails} />}

      <LikeSection
        userHasLiked={userHasLiked}
        handleToggleLike={handleToggleLike}
        post={post}
        handleShowLikers={handleShowLikers}
        likers={likers}
        isUserBookmark={isUserBookmark}
        handleToggleBookmark={handleToggleBookmark}
      />
      <CommentForm postId={post._id} />
      <CommentList postId={post._id} />

      {showLikersModal && <LikersModal likers={likers} closeModal={closeModal} />}
      
      {/* Edit Post Modal */}
      <EditPostModal 
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        post={post}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default PostCard;
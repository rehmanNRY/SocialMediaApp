// PostCard.js
"use client";
import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import CommentForm from "../comment/CommentForm";
import CommentList from "../comment/CommentList";
import LikersModal from "../like/LikersModal";
import LikeSection from "../like/LikeSection";
import { timeAgo } from "@/utility/timeAgo";
import { formatText } from "@/utility/textFormatter";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "@/redux/auth/authSlice";
import {
  deletePost,
  editPost,
  toggleLikePost,
  getPostLikers,
  votePollOption,
  getPollResults
} from "@/redux/posts/postsSlice";
import Link from "next/link";
import { useLoading } from "@/components/LoadingProvider";
import { fetchSavedItems, toggleSavedItem } from "@/redux/savedItems/savedItemsSlice";

const PostCard = ({ post }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editBackgroundColor, setEditBackgroundColor] = useState(post.backgroundColor || 'bg-white');
  const [likers, setLikers] = useState([]);
  const [showLikersModal, setShowLikersModal] = useState(false);
  const [optimisticLiked, setOptimisticLiked] = useState(false);  
  const [optimisticBookmarked, setOptimisticBookmarked] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [pollResults, setPollResults] = useState(null);
  const [isLoadingVote, setIsLoadingVote] = useState(false);
  
  const { showLoadingFor } = useLoading();
  const dispatch = useDispatch();
  
  const { isLoggedIn, userDetails } = useSelector((state) => state.auth);
  const { savedItems } = useSelector((state) => state.savedItems);

  const timePassed = (date) => timeAgo(date);

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

  // Check if user has voted in the poll
  useEffect(() => {
    if (post.poll && post.poll.options && userDetails?._id) {
      // Find if user has voted on any option
      for (const option of post.poll.options) {
        if (option.votes.some(vote => vote._id === userDetails._id || vote === userDetails._id)) {
          setUserVote(option._id);
          break;
        }
      }
    }
  }, [post.poll, userDetails]);

  // Fetch poll results when needed
  useEffect(() => {
    if (post.poll && post.poll.options && post._id) {
      dispatch(getPollResults(post._id)).then((action) => {
        if (action.payload) {
          setPollResults(action.payload.data);
        }
      });
    }
  }, [dispatch, post._id, post.poll]);

  const handleEditPost = () => {
    if (isEditing) {
      dispatch(editPost({ 
        postId: post._id, 
        content: editContent,
        backgroundColor: editBackgroundColor
      }));
    }
    setIsEditing(!isEditing);
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

  // Handle voting on a poll option
  const handleVote = (optionId) => {
    if (!isLoggedIn || isLoadingVote) return;
    
    setIsLoadingVote(true);
    
    // Optimistically update UI
    setUserVote(optionId);
    
    dispatch(votePollOption({ postId: post._id, optionId }))
      .unwrap()
      .then(() => {
        // Refresh poll results
        return dispatch(getPollResults(post._id));
      })
      .then((action) => {
        if (action.payload) {
          setPollResults(action.payload.data);
        }
      })
      .catch((error) => {
        // If there was an error, revert the optimistic update
        setUserVote(null);
        console.error("Error voting on poll:", error);
      })
      .finally(() => {
        setIsLoadingVote(false);
      });
  };

  // Calculate poll percentages
  const calculatePollPercentage = (option) => {
    if (!pollResults || !pollResults.totalVotes) return 0;
    
    const result = pollResults.results.find(r => r._id === option._id);
    return result ? result.percentage : 0;
  };

  // Use optimistic state for UI
  const userHasLiked = optimisticLiked;
  const isUserBookmark = optimisticBookmarked;

  // Determine if poll is active
  const isPollActive = post.poll && post.poll.active;
  const isPollExpired = post.poll && post.poll.endDate && new Date(post.poll.endDate) < new Date();

  return (
    <div className={`${post.backgroundColor || 'bg-white'} p-6 rounded-xl shadow-md relative hover:shadow-xl transition-shadow duration-300`}>
      <div className="flex justify-between items-center mb-4">
        <Link href={`/profile/${post.user?._id}`} className="flex items-center cursor-pointer">
          <img
            src={post.user?.profilePicture}
            alt="User Avatar"
            className="w-12 h-12 rounded-full mr-4 object-cover"
          />
          <div>
            <h4 className="HelvM flex">
              {post.user?.fullName}
              <span className='shadow-sm bg-gray-100 rounded-md text-gray-600 px-2 ml-2 text-sm HelvR flex items-center'>@{post.user?.username.toLowerCase()}</span>
            </h4>
            <p className="HelvR text-gray-700 text-sm">{timePassed(post.createdAt)}</p>
          </div>
        </Link>
        {userDetails?._id === post.user._id && (
          <div className="flex space-x-4 text-gray-600">
            {!isEditing ? <button
              onClick={handleEditPost}
              className="hover:text-blue-500 transition text-xl"
            >
              <FiEdit />
            </button> : <button
              type="submit"
              onClick={handleEditPost}
              className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg hover:bg-blue-700 transition duration-300 flex items-center space-x-2 text-sm"
            >
              <FiEdit className="w-4 h-4" />
              <span>Save changes</span>
            </button>}
            <button
              onClick={handleDeletePost}
              className="hover:text-red-500 transition text-xl"
            >
              <FiTrash2 />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            maxLength={100}
            className="w-full p-2 border border-gray-300 rounded-lg mb-2"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
            <select
              value={editBackgroundColor}
              onChange={(e) => setEditBackgroundColor(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="bg-white">White</option>
              <option value="bg-blue-50">Light Blue</option>
              <option value="bg-purple-50">Light Purple</option>
              <option value="bg-green-50">Light Green</option>
              <option value="bg-yellow-50">Light Yellow</option>
              <option value="bg-pink-50">Light Pink</option>
            </select>
          </div>
        </div>
      ) : (
        <div className="mb-4 text-gray-800">
          <p dangerouslySetInnerHTML={{ __html: formatText(post.content) }}></p>
        </div>
      )}

      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="w-full rounded-lg mb-4 object-cover max-h-[28rem]"
        />
      )}

      {/* Poll display */}
      {post.poll && post.poll.options && post.poll.options.length > 0 && (
        <div className="mt-2 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-800 mb-2">Poll</h4>
            
            <div className="space-y-2">
              {post.poll.options.map((option) => {
                const percentage = calculatePollPercentage(option);
                const isSelected = userVote === option._id;
                
                return (
                  <div key={option._id} className="relative">
                    <button
                      onClick={() => !userVote && isPollActive && !isPollExpired && handleVote(option._id)}
                      disabled={!!userVote || !isPollActive || isPollExpired || isLoadingVote}
                      className={`w-full text-left p-3 rounded-md border relative z-10 transition-all ${
                        isSelected 
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                          : 'border-gray-300 hover:border-gray-400'
                      } ${(!!userVote || !isPollActive || isPollExpired) ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{option.text}</span>
                        {(userVote || !isPollActive || isPollExpired) && (
                          <span className="font-medium">{percentage}%</span>
                        )}
                      </div>
                    </button>
                    
                    {/* Progress bar for results */}
                    {(userVote || !isPollActive || isPollExpired) && (
                      <div 
                        className={`absolute top-0 left-0 h-full rounded-md ${
                          isSelected ? 'bg-indigo-200' : 'bg-gray-200'
                        } transition-all duration-500 z-0`}
                        style={{ width: `${percentage}%`, opacity: 0.5 }}
                      ></div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Poll metadata */}
            <div className="mt-3 text-xs text-gray-500 flex justify-between items-center">
              <div>
                {pollResults && (
                  <span>{pollResults.totalVotes} vote{pollResults.totalVotes !== 1 ? 's' : ''}</span>
                )}
              </div>
              <div>
                {isPollExpired ? (
                  <span className="text-red-500">Poll ended</span>
                ) : post.poll.endDate ? (
                  <span>Ends {new Date(post.poll.endDate).toLocaleDateString()}</span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default PostCard;
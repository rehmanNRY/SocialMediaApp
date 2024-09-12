// PostCard.js
"use client";
import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiBookmark } from "react-icons/fi";
import CommentForm from "../comment/CommentForm";
import CommentList from "../comment/CommentList";
import LikersModal from "../like/LikersModal";
import LikeSection from "../like/LikeSection";
import { timeAgo } from "@/utility/timeAgo";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "@/redux/auth/authSlice";
import {
  deletePost,
  editPost,
  toggleLikePost,
  getPostLikers,
} from "@/redux/posts/postsSlice";

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const { isLoggedIn, userDetails } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [likers, setLikers] = useState([]);
  const [showLikersModal, setShowLikersModal] = useState(false);

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

  const handleEditPost = () => {
    if (isEditing) {
      dispatch(editPost({ postId: post._id, content: editContent }));
    }
    setIsEditing(!isEditing);
  };

  const handleDeletePost = () => {
    dispatch(deletePost(post._id));
  };

  const handleToggleLike = () => {
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

  const userHasLiked = likers.some((liker) => liker._id === userDetails?._id);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-6 relative hover:shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <img
            src={post.user?.profilePicture}
            alt="User Avatar"
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <h4 className="font-semibold text-gray-900">{post.user?.fullName}</h4>
            <p className="text-xs text-gray-600">{timePassed(post.createdAt)}</p>
          </div>
        </div>
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
        <div>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mb-2"
          />
        </div>
      ) : (
        <p className="mb-4 text-gray-800">{post.content}</p>
      )}

      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="w-full rounded-lg mb-4 object-cover"
        />
      )}
      <LikeSection
        userHasLiked={userHasLiked}
        handleToggleLike={handleToggleLike}
        post={post}
        handleShowLikers={handleShowLikers}
        likers={likers}
      />
      <CommentForm postId={post._id} />
      <CommentList postId={post._id} />

      {showLikersModal && <LikersModal likers={likers} closeModal={closeModal} />}
    </div>
  );
};

export default PostCard;
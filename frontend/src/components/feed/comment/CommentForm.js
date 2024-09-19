"use client";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postComment } from '@/redux/comments/commentsSlice';
import { fetchUserDetails } from '@/redux/auth/authSlice';

const CommentForm = ({ postId }) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState('');
  const { isLoggedIn, userDetails } = useSelector((state) => state.auth);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (isLoggedIn) {
      dispatch(fetchUserDetails());
    }
  }, [isLoggedIn, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      dispatch(postComment({ post: postId, content }));
      setContent('');
    }
  };

  if (!isClient) {
    return null; // Render nothing until client-side rendering is confirmed
  }
  return (
    <>
      {isLoggedIn && <form onSubmit={handleSubmit} className={`flex items-center space-x-2 mb-4`}>
        <img
          className="w-10 h-10 rounded-full bg-gray-300 object-cover"
          src={userDetails?.profilePicture}
        />
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-lg bg-[#F8F8F9]"
          placeholder="Write your comment.."
          maxLength={100}
        />
        <button
          type="submit"
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Comment
        </button>
      </form>}
    </>
  );
};

export default CommentForm;
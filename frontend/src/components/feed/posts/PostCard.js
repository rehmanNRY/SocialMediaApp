// components/post/PostCard.js
"use client"
import React from 'react';
import { FiEdit, FiTrash2, FiBookmark } from "react-icons/fi";
import { AiOutlineSend, AiOutlineHeart } from "react-icons/ai";
import { BiShareAlt, BiCommentDetail } from "react-icons/bi";
import CommentForm from '../comment/CommentForm';
import CommentList from '../comment/CommentList';
import { timeAgo } from '@/utility/timeAgo';

const PostCard = ({ post }) => {
  const timePassed = (date) => timeAgo(date);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-6 relative transition-transform transform hover:scale-105 hover:shadow-2xl">
      {/* User Info and Options */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <img
            src={post.image}
            alt="User Avatar"
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <h4 className="font-semibold text-gray-900">{post.user?.fullName}</h4>
            <p className="text-xs text-gray-600">{timePassed(post.createdAt)}</p>
          </div>
        </div>
        {/* Edit, Delete, and Bookmark Options */}
        <div className="flex space-x-4 text-gray-600">
          <button className="hover:text-blue-500 transition text-xl">
            <FiEdit />
          </button>
          <button className="hover:text-red-500 transition text-xl">
            <FiTrash2 />
          </button>
          <button className="hover:text-yellow-500 transition text-xl">
            <FiBookmark />
          </button>
        </div>
      </div>

      {/* Post Description */}
      <p className="mb-4 text-gray-800">{post.content}</p>

      {/* Post Image */}
      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="w-full rounded-lg mb-4 object-cover"
        />
      )}

      {/* Interaction Buttons */}
      <div className="flex justify-around items-center text-gray-600 border-t border-b py-3 mb-4">
        <button className="flex items-center hover:text-red-500 transition">
          <AiOutlineHeart className="mr-1 text-xl" />
          <span className="mr-1">Like</span>
          <span className="text-xs text-white rounded-full px-2 py-0.5 bg-indigo-500">22</span>
        </button>
        <button className="flex items-center hover:text-blue-500 transition">
          <BiCommentDetail className="mr-1 text-xl" />
          <span className="mr-1">Comment</span>
          <span className="text-xs text-white rounded-full px-2 py-0.5 bg-indigo-500">22</span>
        </button>
        <button className="flex items-center hover:text-blue-500 transition">
          <BiShareAlt className="mr-1 text-xl" /> Share
        </button>
      </div>

      {/* Post a New Comment Section */}
      <CommentForm />
      {/* Comments Section */}
      {post.comments.length > 0 && <CommentList comments={post.comments} />}
    </div>
  );
};

export default PostCard;
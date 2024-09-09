"use client"
import React from 'react';
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";

const Comment = ({ comment, timePassed }) => {
  return (
    <div className="flex flex-col space-y-2 relative">
      <div className="flex items-start space-x-3">
        <img
          src="https://via.placeholder.com/40"
          alt="Commenter Avatar"
          className="w-10 h-10 rounded-full"
        />
        <div className="bg-gray-100 p-4 rounded-lg flex-1 shadow-md hover:shadow-lg transition">
          <div className="flex justify-between items-start">
            <h5 className="text-sm font-semibold text-gray-900">
              {comment.user}
            </h5>
            <p className="text-xs text-gray-600">{timePassed(comment.createdAt)}</p>
          </div>
          <p className="text-sm text-gray-800 mt-1">{comment.content}</p>
        </div>
      </div>

      <div className="relative">
        <button className="hover:text-gray-800">
          <BsThreeDots />
        </button>

        <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow-lg hidden group-hover:block">
          <button className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 w-full">
            <FiEdit className="mr-2" /> Edit
          </button>
          <button className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 w-full">
            <FiTrash2 className="mr-2" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Comment;
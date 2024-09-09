import React from 'react'
import { AiOutlineSend } from "react-icons/ai";

const CommentForm = () => {
  return (
    <div className="flex items-center border-t pt-3">
      <textarea
        placeholder="Write a comment..."
        rows="2"
        className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      ></textarea>
      <button
        className="ml-3 p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
        aria-label="Post Comment"
      >
        <AiOutlineSend className="text-lg" />
      </button>
    </div>
  )
}

export default CommentForm
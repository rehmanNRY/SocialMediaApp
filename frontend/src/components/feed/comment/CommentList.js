"use client"
import React, { useState } from 'react';
import Comment from './Comment';
import { timeAgo } from '@/utility/timeAgo';

const CommentList = ({ comments }) => {
  const [showMoreComments, setShowMoreComments] = useState(false);

  const toggleShowMoreComments = () => {
    setShowMoreComments(!showMoreComments);
  };

  const timePassed = (date) => timeAgo(date);

  return (
    <div className="space-y-3 mt-5">
      {(showMoreComments ? comments : comments.slice(0, 2)).map((comment) => (
        <Comment key={comment._id} comment={comment} timePassed={timePassed} />
      ))}
      {comments.length > 2 && !showMoreComments && (
        <button
          className="text-blue-500 text-sm hover:underline"
          onClick={toggleShowMoreComments}
        >
          Show more comments
        </button>
      )}
    </div>
  );
};

export default CommentList;
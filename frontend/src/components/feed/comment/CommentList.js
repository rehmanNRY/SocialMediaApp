"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCommentsByPost } from "@/redux/comments/commentsSlice";
import CommentItem from "./CommentItem";

const CommentList = ({ postId }) => {
  const dispatch = useDispatch();
  
  // Select the comments for the specific post from the Redux store
  const { commentsByPostId } = useSelector((state) => state.comments);
  const comments = commentsByPostId[postId] || []; // Default to empty array if no comments

  const [showMoreComments, setShowMoreComments] = useState(false);

  useEffect(() => {
    if (postId) {
      dispatch(getCommentsByPost(postId));
    }
  }, [dispatch, postId]);

  const toggleShowMoreComments = () => {
    setShowMoreComments(!showMoreComments);
  };

  return (
    <div className="space-y-3 mt-5">
      {(showMoreComments ? comments : comments.slice(0, 2)).map((comment) => (
        <CommentItem key={comment._id} comment={comment} />
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
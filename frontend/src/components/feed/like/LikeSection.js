import React, { useEffect, useState } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getCommentsByPost } from "@/redux/comments/commentsSlice";
import { BiCommentDetail } from "react-icons/bi";
import { fetchSavedItems, toggleSavedItem } from "@/redux/savedItems/savedItemsSlice";
import { FiBookmark } from "react-icons/fi";
import { BsFillBookmarkFill } from "react-icons/bs";

const LikeSection = ({ userHasLiked, handleToggleLike, post, handleShowLikers, likers }) => {
  const dispatch = useDispatch();

  const { commentsByPostId } = useSelector((state) => state.comments);
  const comments = commentsByPostId[post._id] || [];

  const { savedItems } = useSelector((state) => state.savedItems);

  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    dispatch(fetchSavedItems());
  }, [dispatch]);

  useEffect(() => {
    setIsBookmarked(savedItems.some((item) => item.post._id === post._id));
  }, [savedItems, post._id]);

  const handleToggleBookmark = () => {
    dispatch(toggleSavedItem(post._id)).then((action) => {
      // Check if the post was successfully saved or unsaved and update the state accordingly
      const { isSaved } = action.payload;
      setIsBookmarked(!isBookmarked);
    });
  };

  useEffect(() => {
    if (post._id) {
      dispatch(getCommentsByPost(post._id));
    }
  }, [dispatch, post._id]);

  return (
    <>
      <div className="flex items-center space-x-1 mb-2 cursor-pointer" onClick={handleShowLikers}>
        {likers.slice(0, 3).map((liker) => (
          <img
            key={liker._id}
            src={liker.profilePicture}
            alt={liker.fullName}
            className="w-5 h-5 rounded-full shadow-sm"
          />
        ))}
        {likers.length > 0 && <span className="text-sm">Liked by {likers.length}</span>}
      </div>

      <div className="flex justify-around items-center text-gray-600 border-t border-b py-3 mb-4">
        <button
          onClick={handleToggleLike}
          className={`flex items-center transition ${
            userHasLiked ? "text-indigo-500" : "hover:text-indigo-500"
          }`}
        >
          {!userHasLiked ? (
            <AiOutlineLike className="mr-1 text-xl" />
          ) : (
            <AiFillLike className="mr-1 text-xl" />
          )}
          <span className="mr-1">{userHasLiked ? "Liked" : "Like"}</span>
          <span className="text-xs text-white rounded-full px-2 py-0.5 bg-indigo-500">
            {post.likes.length}
          </span>
        </button>
        <button className="flex items-center hover:text-indigo-500 transition">
          <BiCommentDetail className="mr-1 text-xl" />
          <span className="mr-1">Comment</span>
          <span className="text-xs text-white rounded-full px-2 py-0.5 bg-indigo-500">
            {comments?.length || "0"}
          </span>
        </button>
        <button
          onClick={handleToggleBookmark}
          className={`flex items-center transition ${
            isBookmarked ? "text-indigo-500" : "hover:text-indigo-500"
          }`}
        >
          {isBookmarked ? (
            <BsFillBookmarkFill className="mr-1 text-xl" />
          ) : (
            <FiBookmark className="mr-1 text-xl" />
          )}
          <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
        </button>
      </div>
    </>
  );
};

export default LikeSection;

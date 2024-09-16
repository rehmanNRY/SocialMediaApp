import React, { useEffect, useState } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import { FiBookmark } from "react-icons/fi";
import { BsFillBookmarkFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { getCommentsByPost } from "@/redux/comments/commentsSlice";
import { fetchSavedItems, toggleSavedItem } from "@/redux/savedItems/savedItemsSlice";

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
    <div className="bg-white pb-4">
      {/* Likers Section */}
      <div className="flex items-center space-x-2 mb-2 cursor-pointer" onClick={handleShowLikers}>
        {likers.slice(0, 3).map((liker) => (
          <img
            key={liker._id}
            src={liker.profilePicture}
            alt={liker.fullName}
            className="w-6 h-6 rounded-full shadow-sm transition-transform transform hover:scale-110 object-cover"
          />
        ))}
        {likers.length > 0 && (
          <span className="text-sm text-gray-600 hover:text-gray-800 transition">
            Liked by <strong>{likers.length}</strong>
          </span>
        )}
      </div>

      {/* Action Buttons Section */}
      <div className="flex justify-around items-center border-t border-b py-4 space-x-4">
        {/* Like Button */}
        <button
          onClick={handleToggleLike}
          className={`flex items-center space-x-1 transition ${userHasLiked ? "text-blue-500" : "text-gray-600 hover:text-blue-500"
            }`}
        >
          {userHasLiked ? <AiFillLike className="text-2xl" /> : <AiOutlineLike className="text-2xl" />}
          <span className="font-semibold">{userHasLiked ? "Liked" : "Like"}</span>
          <span className="text-xs text-white rounded-full px-2 py-0.5 bg-blue-500">
            {post.likes.length}
          </span>
        </button>

        {/* Comment Button */}
        <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition">
          <BiCommentDetail className="text-2xl" />
          <span className="font-semibold">Comment</span>
          <span className="text-xs text-white rounded-full px-2 py-0.5 bg-blue-500">
            {comments?.length || "0"}
          </span>
        </button>

        {/* Bookmark Button */}
        <button
          onClick={handleToggleBookmark}
          className={`flex items-center space-x-1 transition ${isBookmarked ? "text-blue-500" : "text-gray-600 hover:text-blue-500"
            }`}
        >
          {isBookmarked ? <BsFillBookmarkFill className="text-2xl" /> : <FiBookmark className="text-2xl" />}
          <span className="font-semibold">{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
        </button>
      </div>
    </div>
  );
};

export default LikeSection;

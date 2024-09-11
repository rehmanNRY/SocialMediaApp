// LikeSection.js
import React from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { BiCommentDetail, BiShareAlt } from "react-icons/bi";

const LikeSection = ({ userHasLiked, handleToggleLike, post, handleShowLikers, likers }) => (
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
        className={`flex items-center transition ${userHasLiked ? "text-indigo-500" : "hover:text-indigo-500"}`}
      >
        {!userHasLiked ? <AiOutlineLike className="mr-1 text-xl" /> : <AiFillLike className="mr-1 text-xl" />}
        <span className="mr-1">{userHasLiked ? 'Liked' : 'Like'}</span>
        <span className="text-xs text-white rounded-full px-2 py-0.5 bg-indigo-500">
          {post.likes.length}
        </span>
      </button>
      <button className="flex items-center hover:text-indigo-500 transition">
        <BiCommentDetail className="mr-1 text-xl" />
        <span className="mr-1">Comment</span>
        <span className="text-xs text-white rounded-full px-2 py-0.5 bg-indigo-500">
          {post.comments?.length || "0"}
        </span>
      </button>
      <button className="flex items-center hover:text-indigo-500 transition">
        <BiShareAlt className="mr-1 text-xl" /> Share
      </button>
    </div>
  </>
);

export default LikeSection;

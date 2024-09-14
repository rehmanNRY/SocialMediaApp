import React from 'react';
import PostForm from "@/components/feed/posts/PostForm";
import PostList from "@/components/feed/posts/PostList";

const Posts = ({ userPosts, loggedInUserId, user }) => (
  <div className="bg-[#F5F6FA] px-7 py-4 shadow-md">
    {loggedInUserId === user._id && <div className='my-4'><PostForm /></div>}
    <PostList posts={userPosts} />
  </div>
);

export default Posts;

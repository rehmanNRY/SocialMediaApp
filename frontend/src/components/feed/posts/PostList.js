import React from 'react';
import PostCard from './PostCard';

const PostList = ({posts}) => {
  return (
    <>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </>
  );
};

export default PostList;
"use client";

import { getAllPosts } from '@/redux/posts/postsSlice';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PostCard from './PostCard';

const PostList = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  return (
    <>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </>
  );
};

export default PostList;
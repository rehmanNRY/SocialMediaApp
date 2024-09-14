"use client"
import PostForm from "@/components/feed/posts/PostForm";
import PostList from "@/components/feed/posts/PostList";
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/redux/posts/postsSlice';
import { fetchUserDetails } from '@/redux/auth/authSlice';
import AuthRedirect from '@/components/AuthRedirect';

const myPosts = () => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.auth);
  const posts = useSelector((state) => state.posts.posts);
  const userPosts = posts.filter((post) => post.user._id === userDetails._id);

  useEffect(() => {
    dispatch(getAllPosts());
    dispatch(fetchUserDetails());
  }, [dispatch]);

  return (
    <AuthRedirect>
      <main className="bg-[#F5F6FA] mx-auto p-4 space-y-6 w-full">
        <PostForm />
        <PostList posts={userPosts} />
      </main>
    </AuthRedirect>
  );
};

export default myPosts;
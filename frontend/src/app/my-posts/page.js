"use client"
import PostForm from "@/components/feed/posts/PostForm";
import PostList from "@/components/feed/posts/PostList";
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/redux/posts/postsSlice';
import { fetchUserDetails } from '@/redux/auth/authSlice';
import AuthRedirect from '@/components/AuthRedirect';
import { BsFillPostcardFill } from "react-icons/bs";

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
      <main className="bg-[#F5F6FA] mx-auto p-4 space-y-6 w-full"
      style={{ minHeight: "calc(100vh - 3.5rem)" }}
      >
        <h1 className="text-2xl text-gray-800 mb-8 flex items-center">
          <BsFillPostcardFill className="text-pink-500 mr-2" />
          Your Posts</h1>
        <PostForm />
        {userPosts.length > 0 ? (
          <PostList posts={userPosts} />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-10">
            <BsFillPostcardFill className="text-gray-300 text-6xl mb-4" />
            <p className="text-xl text-gray-500">The posts you made.</p>
            <p className="text-sm text-gray-400 mt-2">
              No posts to show
            </p>
          </div>
        )}
      </main>
    </AuthRedirect>
  );
};

export default myPosts;
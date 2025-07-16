// TODO:
// immediate update & speed up
// responsive

"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/redux/posts/postsSlice";
import AuthRedirect from "@/components/AuthRedirect";
import PostForm from "@/components/feed/posts/PostForm";
import PostList from "@/components/feed/posts/PostList";
import { BsFillPostcardFill } from "react-icons/bs";
import StorySection from "@/components/feed/stories/StorySection";
import RunningServer from "@/components/RunningServer";
import axios from "axios";
import { ProfilePicVerify } from "@/components";

export default function Home() {
  const dispatch = useDispatch();
  const allPosts = useSelector((state) => state.posts.posts);
  const [isServerRunning, setIsServerRunning] = useState(false);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API}/`);
        if (response.data === "Server is running!") {
          setIsServerRunning(true);
        }
      } catch (error) {
        setIsServerRunning(false);
      }
    };
    checkServer();
  }, []);


  useEffect(() => {
    if(isServerRunning){
      dispatch(getAllPosts());
    }
  }, [dispatch, isServerRunning]);

  if (!isServerRunning) {
    return <RunningServer />;
  }

  return (
    <AuthRedirect>
      <main className="bg-[#F5F6FA] mx-auto p-4 space-y-3 w-full min-h-screen">
        <ProfilePicVerify />
        <StorySection />
        <PostForm />
        {allPosts.length > 0 ? (
          <PostList posts={allPosts} />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-10">
            <BsFillPostcardFill className="text-gray-300 text-6xl mb-4" />
            <p className="text-xl text-gray-500">List of Posts.</p>
            <p className="text-sm text-gray-400 mt-2">
              No posts to show
            </p>
          </div>
        )}
      </main>
    </AuthRedirect>
  );
}

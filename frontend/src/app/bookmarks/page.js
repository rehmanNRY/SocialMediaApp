"use client";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PostList from "@/components/feed/posts/PostList";
import { fetchSavedItems } from "@/redux/savedItems/savedItemsSlice";
import AuthRedirect from '@/components/AuthRedirect';
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";

export default function Bookmarks() {
  const dispatch = useDispatch();
  const { savedItems, status, error } = useSelector((state) => state.savedItems);
  // console.log("use savedItems",savedItems)

  useEffect(() => {
    // Fetch the saved (bookmarked) items when the component mounts
    dispatch(fetchSavedItems());
  }, [dispatch]);

  // Filter and prepare the bookmarked posts from saved items
  const bookmarkedPosts = savedItems.map((item) => item.post);

  return (
    <AuthRedirect>
      <main className="bg-[#F5F6FA] mx-auto p-4 space-y-6 w-full"
      style={{ minHeight: "calc(100vh - 3.5rem)" }}
      >
        <h1 className="text-2xl text-gray-800 mb-8 flex items-center">
          <BsBookmarkFill className="text-yellow-500 mr-2" />
          Bookmarks List</h1>
        {status === "loading" && <p>Loading bookmarks...</p>}
        {status === "failed" && <p>Error: {error}</p>}
        {bookmarkedPosts.length > 0 ? (
          <PostList posts={bookmarkedPosts} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-10">
            <BsBookmark className="text-gray-300 text-6xl mb-4" />
            <p className="text-xl text-gray-500">The list of bookmarks you make.</p>
            <p className="text-sm text-gray-400 mt-2">
              No bookmarks found
            </p>
          </div>
        )}
      </main>
    </AuthRedirect>
  );
}
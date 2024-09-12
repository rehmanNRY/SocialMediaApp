"use client";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PostList from "@/components/feed/posts/PostList";
import { fetchSavedItems } from "@/redux/savedItems/savedItemsSlice";

export default function Bookmarks() {
  const dispatch = useDispatch();
  const {savedItems, status, error} = useSelector((state) => state.savedItems);
  // console.log("use savedItems",savedItems)

  useEffect(() => {
    // Fetch the saved (bookmarked) items when the component mounts
    dispatch(fetchSavedItems());
  }, [dispatch]);

  // Filter and prepare the bookmarked posts from saved items
  const bookmarkedPosts = savedItems.map((item) => item.post);

  return (
    <main className="bg-[#F5F6FA] mx-auto p-4 space-y-6 w-full">
      <h1>Bookmarks List</h1>
      {status === "loading" && <p>Loading bookmarks...</p>}
      {status === "failed" && <p>Error: {error}</p>}
      {bookmarkedPosts.length > 0 ? (
        <PostList posts={bookmarkedPosts} />
      ) : (
        <p>No bookmarks found.</p>
      )}
    </main>
  );
}
"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import PostList from "@/components/feed/posts/PostList";
import { fetchSavedItems } from "@/redux/savedItems/savedItemsSlice";
import AuthRedirect from '@/components/AuthRedirect';
import { BsBookmark, BsBookmarkFill, BsArrowUpCircle } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";

export default function Bookmarks() {
  const dispatch = useDispatch();
  const { savedItems, status, error } = useSelector((state) => state.savedItems);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // Fetch the saved (bookmarked) items when the component mounts
    dispatch(fetchSavedItems());

    // Add scroll listener for scroll-to-top button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter and prepare the bookmarked posts from saved items
  const bookmarkedPosts = savedItems.map((item) => item.post);

  return (
    <AuthRedirect>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-white to-blue-50 mx-auto p-6 space-y-6 w-full rounded-lg shadow-sm"
        style={{ minHeight: "calc(100vh - 3.5rem)" }}
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="flex items-center justify-between"
        >
          <motion.h1
            className="text-3xl font-bold text-indigo-700 mb-2 mt-4 flex items-center"
            whileHover={{ scale: 1.03 }}
          >
            <motion.div
              whileHover={{ rotate: 15 }}
              className="mr-3"
            >
              <BsBookmarkFill className="text-indigo-500 text-3xl" />
            </motion.div>
            Bookmarks
          </motion.h1>
        </motion.div>

        {status === "loading" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center p-10"
          >
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-indigo-600 mt-4 font-medium">Loading your bookmarks...</p>
            </div>
          </motion.div>
        )}

        {status === "failed" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 p-4 rounded-lg border border-red-200"
          >
            <p className="text-red-600 font-medium">Error: {error}</p>
          </motion.div>
        )}

        {bookmarkedPosts.length > 0 ? (

            <PostList posts={bookmarkedPosts} />
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center h-80 text-center p-10 bg-white rounded-2xl shadow-sm"
          >
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <BsBookmark className="text-indigo-300 text-7xl mb-6" />
            </motion.div>
            <motion.p
              className="text-2xl text-indigo-700 font-medium"
              whileHover={{ scale: 1.05 }}
            >
              Your Bookmark Collection
            </motion.p>
            <motion.p className="text-indigo-400 mt-3 max-w-md">
              Save posts you want to revisit later by bookmarking them. Your bookmarks will appear here.
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-full font-medium shadow-md hover:bg-indigo-700 transition-colors"
            >
              Explore Content
            </motion.button>
          </motion.div>
        )}
      </motion.main>
    </AuthRedirect>
  );
}
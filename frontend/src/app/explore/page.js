"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import PostList from "@/components/feed/posts/PostList";
import { getAllPosts } from "@/redux/posts/postsSlice";
import AuthRedirect from '@/components/AuthRedirect';
import { MdExplore } from "react-icons/md";
import { BsArrowUpCircle } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";

const Explore = () => {
  const dispatch = useDispatch();
  const { posts, status, error } = useSelector((state) => state.posts);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // Fetch all posts when the component mounts
    dispatch(getAllPosts());

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
              <MdExplore className="text-indigo-500 text-3xl" />
            </motion.div>
            Explore
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
              <p className="text-indigo-600 mt-4 font-medium">Loading posts...</p>
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

        {posts && posts.length > 0 ? (
            <PostList posts={posts} />
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
              <MdExplore className="text-indigo-400 text-6xl mb-4" />
            </motion.div>
            <h2 className="text-2xl font-bold text-indigo-600 mb-2">No Posts Found</h2>
            <p className="text-gray-600 mb-4">Looks like there aren't any posts to explore yet.</p>
          </motion.div>
        )}

        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
              aria-label="Scroll to top"
            >
              <BsArrowUpCircle className="text-xl" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.main>
    </AuthRedirect>
  );
};

export default Explore;
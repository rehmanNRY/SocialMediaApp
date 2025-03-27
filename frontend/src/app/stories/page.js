"use client";
import StoryForm from '@/components/feed/stories/StoryForm';
import { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { FiRefreshCw, FiCamera, FiUser } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllStories } from '@/redux/story/storySlice';
import AuthRedirect from '@/components/AuthRedirect';
import Link from 'next/link';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';

export default function StorySection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hoveredStory, setHoveredStory] = useState(null);

  const dispatch = useDispatch();
  const { stories } = useSelector((state) => state.story);

  // Fetch stories on component mount
  useEffect(() => {
    dispatch(fetchAllStories());
  }, [dispatch]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const refreshStories = () => {
    setIsRefreshing(true);
    dispatch(fetchAllStories()).finally(() => {
      setTimeout(() => setIsRefreshing(false), 800);
    });
  };

  // Create a set to track unique user IDs
  const uniqueUserStories = [];
  const seenUserIds = new Set();

  // Iterate through stories to filter out duplicate users
  if (stories && stories.length > 0) {
    stories.forEach((story) => {
      if (!seenUserIds.has(story.user._id)) {
        uniqueUserStories.push(story);
        seenUserIds.add(story.user._id);
      }
    });
  }

  const storyToast = (toastType) => {
    if (toastType === 'success') {
      toast.success('Story created successfully');
    } else {
      toast.error('Error creating story');
    }
  }
  
  return (
    <AuthRedirect>
      <ToastContainer autoClose={1000} />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 p-4 sm:p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <motion.h1 
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >
            Stories
          </motion.h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshStories}
            className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300"
          >
            <FiRefreshCw 
              className={`text-indigo-600 ${isRefreshing ? 'animate-spin' : ''}`} 
              size={20} 
            />
          </motion.button>
        </div>
        
        <motion.div 
          layout
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        >
          {/* Create Story Card */}
          <motion.div 
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.2)"
            }}
            whileTap={{ scale: 0.98 }}
            onClick={openModal} 
            className="cursor-pointer flex flex-col items-center justify-center w-full h-64 bg-white rounded-2xl shadow-md overflow-hidden relative group"
          >
            <motion.div 
              whileHover={{ y: -5 }}
              className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg"
            >
              <FiCamera className="text-white" size={24} />
            </motion.div>
            <p className="mt-4 text-sm font-medium text-gray-700 text-center">Create Story</p>
            <motion.div 
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-t from-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </motion.div>

          {/* User Story Cards */}
          <AnimatePresence>
            {uniqueUserStories.map((story) => (
              <motion.div
                key={story._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  transition: { type: "spring", stiffness: 300 }
                }}
                onHoverStart={() => setHoveredStory(story._id)}
                onHoverEnd={() => setHoveredStory(null)}
                className="relative w-full h-64 rounded-2xl shadow-md overflow-hidden"
              >
                <Link href={`story/${story._id}`} className="block w-full h-full">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
                  
                  <motion.div 
                    animate={{ 
                      scale: hoveredStory === story._id ? 1.1 : 1
                    }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${story.image || story.user.coverImage})` }}
                  />
                  
                  {/* Avatar */}
                  <motion.div 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20"
                  >
                    <div className="w-16 h-16 rounded-full border-3 border-indigo-500 bg-white p-1 shadow-lg">
                      <img
                        src={story.user.profilePicture}
                        alt={story.user.fullName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  </motion.div>
                  
                  {/* Name */}
                  <motion.div 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="absolute bottom-6 left-0 right-0 text-white text-center z-20"
                  >
                    <p className="text-lg font-medium drop-shadow-md">{story.user.fullName}</p>
                    <p className="text-xs text-indigo-200 mt-1">@{story.user.username || 'username'}</p>
                  </motion.div>
                  
                  {/* Pulse effect */}
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.7, 0.9, 0.7]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full z-20"
                  />
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        <StoryForm isOpen={isModalOpen} onClose={closeModal} storyToast={storyToast} />
      </motion.div>
    </AuthRedirect>
  );
}

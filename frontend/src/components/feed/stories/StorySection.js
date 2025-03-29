"use client";
import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllStories } from '@/redux/story/storySlice';
import { fetchUserDetails } from '@/redux/auth/authSlice';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi';

export default function StorySection() {
  const dispatch = useDispatch();
  const { stories, loading } = useSelector((state) => state.story);
  const { isLoggedIn, userDetails } = useSelector((state) => state.auth);
  const [hoveredStory, setHoveredStory] = useState(null);

  // Fetch stories on component mount
  useEffect(() => {
    dispatch(fetchAllStories());
    if (isLoggedIn) {
      dispatch(fetchUserDetails());
    }
  }, [isLoggedIn, dispatch]);

  const scrollContainerRef = useRef(null);

  // Scroll the stories section
  const scrollStories = (direction) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -250 : 250,
        behavior: 'smooth',
      });
    }
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full max-w-full overflow-hidden mb-5"
    >
      {/* Scroll buttons */}
      <motion.button
        whileHover={{ scale: 1.1, backgroundColor: "#ffffff" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => scrollStories('left')}
        className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-lg z-10 flex items-center justify-center text-indigo-600 border border-indigo-100 opacity-60 hover:opacity-100"
      >
        <FiChevronLeft size={18} />
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.1, backgroundColor: "#ffffff" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => scrollStories('right')}
        className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-lg z-10 flex items-center justify-center text-indigo-600 border border-indigo-100 opacity-60 hover:opacity-100"
      >
        <FiChevronRight size={18} />
      </motion.button>

      <div className="bg-white rounded-xl shadow-sm border border-indigo-100 overflow-hidden">
        <div className="p-5 overflow-x-auto scrollbar-hide" ref={scrollContainerRef}>
          <div className="flex space-x-5">
            {userDetails && (
              <motion.div whileHover={{ y: -5 }} className="flex-shrink-0">
                <Link href='/stories' className="flex flex-col items-center justify-center text-center cursor-pointer">
                  <div className="relative">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-blue-600 p-[2px]"
                    >
                      <div className="w-full h-full rounded-full overflow-hidden bg-white p-[2px]">
                        <img
                          src={userDetails.profilePicture}
                          alt={userDetails.fullName}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    </motion.div>
                    {/* Plus icon */}
                    <motion.div 
                      whileHover={{ scale: 1.2, rotate: 90 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="absolute bottom-0 right-0 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full w-7 h-7 flex items-center justify-center border-2 border-white shadow-md"
                    >
                      <FiPlus className="text-white" size={16} />
                    </motion.div>
                  </div>
                  <span className="text-sm font-medium mt-2 text-indigo-800">Add Story</span>
                </Link>
              </motion.div>
            )}
            
            {uniqueUserStories.map((story) => (
              <motion.div 
                key={story._id} 
                whileHover={{ y: -5 }}
                className="flex-shrink-0"
                onHoverStart={() => setHoveredStory(story._id)}
                onHoverEnd={() => setHoveredStory(null)}
              >
                <Link href={`story/${story._id}`} className="flex flex-col items-center justify-center text-center cursor-pointer max-w-20">
                  <div className="relative">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className={`w-20 h-20 rounded-full overflow-hidden ${hoveredStory === story._id ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-indigo-400 to-blue-500'} p-[2px]`}
                    >
                      <div className="w-full h-full rounded-full overflow-hidden bg-white p-[2px]">
                        <img
                          src={story.user.profilePicture}
                          alt={story.user.fullName}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    </motion.div>
                    
                    <AnimatePresence>
                      {hoveredStory === story._id && (
                        <motion.div 
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute -bottom-1 -right-1 left-0 w-full h-full"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-full animate-pulse"></div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <motion.span 
                    className="text-sm font-medium mt-2 text-gray-800"
                    animate={{ color: hoveredStory === story._id ? "#4F46E5" : "#1F2937" }}
                  >
                    {story.user.fullName}
                  </motion.span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Gradient edges */}
        <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
        <div className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none"></div>
      </div>
    </motion.div>
  );
}

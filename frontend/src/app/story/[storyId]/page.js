"use client";
import { useState, useEffect, useRef } from "react";
import { AiOutlineClose, AiOutlinePlus, AiOutlinePauseCircle, AiOutlinePlayCircle } from "react-icons/ai";
import { MdOutlineKeyboardArrowLeft, MdChevronLeft, MdChevronRight } from "react-icons/md";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllStories } from "@/redux/story/storySlice";
import { motion, AnimatePresence } from "framer-motion";
import { timeAgo } from "@/utility/timeAgo";
import StoryForm from '@/components/feed/stories/StoryForm';
import AuthRedirect from '@/components/AuthRedirect';
import { Loading } from "@/components";

const Page = ({ params }) => {
  const dispatch = useDispatch();
  const { stories } = useSelector((state) => state.story);
  const storyId = params.storyId;
  const [storyToShow, setStoryToShow] = useState(null);
  const [visibleStories, setVisibleStories] = useState(5);
  const [showMore, setShowMore] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef(null);
  const [storyDuration, setStoryDuration] = useState(5000);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Clear interval on component unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const timePassed = (date) => timeAgo(date);

  useEffect(() => {
    dispatch(fetchAllStories());
  }, [dispatch]);

  // Group stories by user
  const groupedStories = stories.reduce((acc, story) => {
    const userId = story.user._id;
    if (!acc[userId]) {
      acc[userId] = {
        user: story.user,
        stories: [],
      };
    }
    acc[userId].stories.push(story);
    return acc;
  }, {});

  const users = Object.values(groupedStories);

  useEffect(() => {
    if (stories.length > 0 && storyId) {
      const foundStory = stories.find((story) => story._id === storyId);
      setStoryToShow(foundStory || null);
    }
  }, [stories, storyId]);

  // Handle showing more/less stories
  const handleShowMore = () => {
    setVisibleStories(showMore ? 5 : users.length);
    setShowMore(!showMore);
  };

  // Move to next story after interval
  useEffect(() => {
    let timer;
    if (storyToShow && isPlaying) {
      const userStories = groupedStories[storyToShow.user._id].stories;
      const nextStoryIndex = (currentStoryIndex + 1) % userStories.length;

      // Reset progress and start interval
      setProgress(0);
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setStoryToShow(userStories[nextStoryIndex]);
            setCurrentStoryIndex(nextStoryIndex);
            return 0;
          }
          return prev + 1;
        });
      }, 50);
    }

    return () => clearInterval(timer);
  }, [storyToShow, currentStoryIndex, isPlaying]);

  // Handle playing/pausing stories and updating progress
  useEffect(() => {
    const startTime = Date.now() - elapsedTime;
    if (isPlaying) {
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / storyDuration) * 100, 100);

        setProgress(newProgress);

        if (newProgress >= 100) {
          setElapsedTime(0);
          clearInterval(progressIntervalRef.current);
          handleNextStory();
        }
      }, 100);

      return () => clearInterval(progressIntervalRef.current);
    } else {
      setElapsedTime(Date.now() - startTime);
      clearInterval(progressIntervalRef.current);
    }
  }, [isPlaying, currentStoryIndex]);

  // Move to the next story manually
  const handleNextStory = () => {
    if (storyToShow && storyToShow.user) {
      const userStories = groupedStories[storyToShow.user._id]?.stories || [];
      const nextStoryIndex = (currentStoryIndex + 1) % userStories.length;
      setStoryToShow(userStories[nextStoryIndex]);
      setCurrentStoryIndex(nextStoryIndex);
    } else {
      console.error("storyToShow or storyToShow.user is null");
    }
  };

  // Handle play/pause button
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Click on progress bar to go to a specific story
  const handleProgressClick = (storyIndex) => {
    const userStories = groupedStories[storyToShow.user._id].stories;
    setStoryToShow(userStories[storyIndex]);
    setCurrentStoryIndex(storyIndex);
    setProgress(0);
    setElapsedTime(0);
    setIsPlaying(true);
  };

  // Navigate to next/previous user's story
  const handleNextUser = () => {
    const currentUserIndex = users.findIndex((userGroup) => userGroup.user._id === storyToShow.user._id);
    if (currentUserIndex < users.length - 1) {
      setStoryToShow(users[currentUserIndex + 1].stories[0]);
      setCurrentStoryIndex(0);
    }
  };

  const handlePrevUser = () => {
    const currentUserIndex = users.findIndex((userGroup) => userGroup.user._id === storyToShow.user._id);
    if (currentUserIndex > 0) {
      setStoryToShow(users[currentUserIndex - 1].stories[0]);
      setCurrentStoryIndex(0);
    }
  };

  if (!storyToShow) {
    return <Loading />;
  }

  return (
    <AuthRedirect>
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col-reverse lg:flex-row items-center justify-between min-h-screen fixed h-full w-screen z-50 inset-0 lg:overflow-hidden overflow-y-auto">
        <StoryForm isOpen={isModalOpen} onClose={closeModal} />

        {/* Back Home Button */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-4 right-4 z-20"
        >
          <Link href="/" className="bg-white/80 backdrop-blur-md text-indigo-600 px-4 py-2.5 rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-all duration-300 flex items-center text-sm font-medium">
            <MdOutlineKeyboardArrowLeft className="mr-1" />
            Back Home
          </Link>
        </motion.div>

        {/* Left Sidebar */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="p-6 shadow-2xl w-full lg:w-1/3 h-full bg-white/90 backdrop-blur-md rounded-none lg:rounded-l-2xl relative"
        >
          <div className="flex items-center justify-between mb-8">
            <Link href="/stories">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="bg-gray-100 p-2 rounded-full"
              >
                <AiOutlineClose className="text-indigo-600 w-6 h-6" />
              </motion.div>
            </Link>
            <Link href="/" className="flex items-center">
              <motion.img
                whileHover={{ scale: 1.2, rotate: 10 }}
                src="/images/rehman_logo.png"
                alt="Logo"
                className="w-10 mr-2"
              />
              <span className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-xl">Rehman</span>
            </Link>
          </div>

          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">Stories</h2>

          {/* Create a Story Button */}
          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={openModal} 
            className="mb-8 flex items-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer border border-indigo-100"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
              <AiOutlinePlus className="text-white text-2xl" />
            </div>
            <div className="ml-4">
              <h4 className="font-semibold text-gray-800 text-lg">Create a story</h4>
              <p className="text-sm text-gray-500">Share a photo or write something.</p>
            </div>
          </motion.div>

          {/* Story List - Grouped by User */}
          <div className="space-y-3 overflow-y-auto h-2/3 lg:h-5/6 scrollbar-thin scrollbar-thumb-indigo-400 pr-2">
            <AnimatePresence>
              {users.slice(0, visibleStories).map((userGroup, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`${userGroup.stories[0]._id}`}>
                    <motion.div 
                      whileHover={{ scale: 1.03, x: 5 }}
                      className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-indigo-500"
                    >
                      <div className="flex items-center cursor-pointer">
                        <motion.div 
                          whileHover={{ scale: 1.1 }}
                          className="w-16 h-16 rounded-full border-2 border-indigo-400 bg-white p-0.5 shadow-md overflow-hidden"
                        >
                          <img
                            src={userGroup.user.profilePicture}
                            alt={userGroup.user.fullName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </motion.div>
                        <div className="flex justify-center ml-4 flex-col">
                          <h5 className="font-semibold text-gray-800">{userGroup.user.fullName}</h5>
                          <p className="text-gray-600 text-sm">{userGroup.stories[0].content.slice(0, 20)}...</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-sm text-indigo-500 font-medium">
                          {timePassed(userGroup.stories[0].createdAt)}
                        </p>
                        <span className="text-xs text-gray-400 mt-1">{userGroup.stories.length} stories</span>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Show more/less button */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full mt-6 py-2.5 text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300" 
            onClick={handleShowMore}
          >
            {showMore ? "Show less" : "Show more"}
          </motion.button>
        </motion.div>

        {/* Story Content */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="w-full lg:w-2/3 flex justify-center"
        >
          <div className="w-full lg:w-[36rem] h-screen bg-slate-800 shadow-2xl rounded-none lg:rounded-r-2xl relative flex flex-col justify-between items-center px-4 pb-8 pt-4 bg-cover bg-center overflow-hidden"
            style={{ backgroundImage: `url(${storyToShow?.image})` }}>
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 z-0"></div>

            {/* Story Header */}
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative z-10 w-full"
            >
              <Link href={`/profile/${storyToShow?.user?._id}`} className="flex items-center bg-white/90 backdrop-blur-md py-3 px-4 rounded-xl shadow-lg mx-auto max-w-md">
                <motion.img 
                  whileHover={{ scale: 1.1 }}
                  src={storyToShow?.user.profilePicture} 
                  alt={storyToShow?.user.fullName} 
                  className="w-10 h-10 rounded-full mr-4 object-cover border-2 border-indigo-400" 
                />
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{storyToShow?.user.fullName}</h3>
                  <p className="text-indigo-500 text-sm font-medium">{timePassed(storyToShow?.createdAt)}</p>
                </div>
                
                {/* Play/Pause Button */}
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="ml-auto bg-indigo-100 p-2 rounded-full text-indigo-600" 
                  onClick={handlePlayPause}
                >
                  {isPlaying ? (
                    <AiOutlinePauseCircle className="w-6 h-6" />
                  ) : (
                    <AiOutlinePlayCircle className="w-6 h-6" />
                  )}
                </motion.button>
              </Link>
            </motion.div>

            {/* Progress bar */}
            <div className="w-full h-1 relative flex space-x-1 z-10 mt-4">
              {groupedStories[storyToShow.user._id].stories.map((story, index) => (
                <motion.div 
                  key={story._id} 
                  className="relative h-full rounded-full overflow-hidden transition-all duration-300 cursor-pointer"
                  style={{
                    width: `${100 / groupedStories[storyToShow.user._id].stories.length}%`,
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                  }}
                  onClick={() => handleProgressClick(index)}
                >
                  <motion.div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-100"
                    style={{
                      width: index === currentStoryIndex ? `${progress}%` : index < currentStoryIndex ? "100%" : "0%",
                    }} 
                  />
                </motion.div>
              ))}
            </div>

            {/* Story Content */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative z-10 w-full max-w-md mx-auto mt-auto mb-4"
            >
              <div className="bg-white/90 backdrop-blur-md text-gray-800 py-4 px-6 rounded-xl shadow-lg">
                <p className="text-lg font-medium">{storyToShow?.content}</p>
              </div>
            </motion.div>

            {/* Navigation Buttons */}
            {users.findIndex((userGroup) => userGroup.user._id === storyToShow.user._id) > 0 && (
              <motion.button 
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrevUser} 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-all duration-300 z-10"
              >
                <MdChevronLeft className="text-indigo-600 hover:text-white w-8 h-8" />
              </motion.button>
            )}
            {users.findIndex((userGroup) => userGroup.user._id === storyToShow.user._id) < users.length - 1 && (
              <motion.button 
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNextUser} 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-all duration-300 z-10"
              >
                <MdChevronRight className="text-indigo-600 hover:text-white w-8 h-8" />
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </AuthRedirect>
  );
};

export default Page;
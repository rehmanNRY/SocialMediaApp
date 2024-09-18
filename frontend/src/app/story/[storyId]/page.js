"use client";
import { useState, useEffect, useRef } from "react";
import { AiOutlineClose, AiOutlinePlus, AiOutlinePauseCircle, AiOutlinePlayCircle } from "react-icons/ai";
import { MdOutlineKeyboardArrowLeft, MdChevronLeft, MdChevronRight } from "react-icons/md";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllStories } from "@/redux/story/storySlice";
import { motion } from "framer-motion";
import { timeAgo } from "@/utility/timeAgo";
import StoryForm from '@/components/feed/stories/StoryForm';
import AuthRedirect from '@/components/AuthRedirect';

const Page = ({ params }) => {
  const dispatch = useDispatch();
  const { stories } = useSelector((state) => state.story);
  const storyId = params.storyId;
  const [storyToShow, setStoryToShow] = useState(null);
  const [visibleStories, setVisibleStories] = useState(5); // Show 5 stories initially
  const [showMore, setShowMore] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0); // For handling story navigation
  const [isPlaying, setIsPlaying] = useState(true); // Play/pause state

  const [progress, setProgress] = useState(0); // Track progress for the current story
  const progressIntervalRef = useRef(null); // Ref to store the progress interval ID
  const [storyDuration, setStoryDuration] = useState(5000); // Duration of each story (in ms)
  const [elapsedTime, setElapsedTime] = useState(0); // Track elapsed time

  // Clear interval on component unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const users = Object.values(groupedStories); // Get list of users with their stories

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
          return prev + 1; // Adjust the increment speed as needed
        });
      }, 50); // Adjust this interval to control the speed of progress (e.g., 50ms)
    }

    return () => clearInterval(timer);
  }, [storyToShow, currentStoryIndex, isPlaying]);

  // Handle playing/pausing stories and updating progress
  useEffect(() => {
    const startTime = Date.now() - elapsedTime; // Adjust start time based on elapsed time
    if (isPlaying) {

      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / storyDuration) * 100, 100);

        setProgress(newProgress);

        if (newProgress >= 100) {
          // Move to the next story automatically when the current one completes
          setElapsedTime(0);
          clearInterval(progressIntervalRef.current);
          handleNextStory();
        }
      }, 100);

      return () => clearInterval(progressIntervalRef.current);
    } else {
      setElapsedTime(Date.now() - startTime); // Pause at the current time
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
    setIsPlaying(!isPlaying); // Toggle play/pause
  };

  // Click on progress bar to go to a specific story
  const handleProgressClick = (storyIndex) => {
    const userStories = groupedStories[storyToShow.user._id].stories;
    setStoryToShow(userStories[storyIndex]);
    setCurrentStoryIndex(storyIndex);
    setProgress(0); // Reset progress
    setElapsedTime(0); // Reset elapsed time
    setIsPlaying(true); // Start playing
  };

  // Navigate to next/previous user's story
  const handleNextUser = () => {
    const currentUserIndex = users.findIndex((userGroup) => userGroup.user._id === storyToShow.user._id);
    if (currentUserIndex < users.length - 1) {
      setStoryToShow(users[currentUserIndex + 1].stories[0]);
      setCurrentStoryIndex(0); // Reset to the first story of the next user
    }
  };

  const handlePrevUser = () => {
    const currentUserIndex = users.findIndex((userGroup) => userGroup.user._id === storyToShow.user._id);
    if (currentUserIndex > 0) {
      setStoryToShow(users[currentUserIndex - 1].stories[0]);
      setCurrentStoryIndex(0); // Reset to the first story of the previous user
    }
  };

  if (!storyToShow) {
    return <div>Loading...</div>;
  }

  return (
    <AuthRedirect>
      <div className="bg-[#F5F6FA] flex items-center justify-between min-h-screen fixed h-full w-screen z-50 inset-0 overflow-hidden">
        <StoryForm isOpen={isModalOpen} onClose={closeModal} />
        <div className="absolute top-4 right-4">
          <Link href="/" className="bg-gray-200 text-gray-800 px-3 py-2 rounded-full shadow hover:bg-gray-300 transition duration-200 flex items-center text-sm">
            <MdOutlineKeyboardArrowLeft />
            Back Home
          </Link>
        </div>

        {/* Left Sidebar */}
        <div className="p-6 shadow-lg w-1/3 h-full bg-white rounded-l-lg relative">
          <div className="flex items-center justify-between mb-6">
            <Link href="/stories">
              <AiOutlineClose className="text-gray-600 w-8 h-8 hover:text-gray-900 transition" />
            </Link>
            <Link href="/" className="flex items-center">
              <img
                src="/images/rehman_logo.png"
                alt="Logo"
                className="w-10 mr-2 transition duration-300 hover:scale-110"
              />
              <span className="font-bold text-gray-700 text-xl">Rehman</span>
            </Link>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Stories</h2>

          {/* Create a Story Button */}
          <div onClick={openModal} className="mb-6 flex items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-300 cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
              <AiOutlinePlus className="text-indigo-500 text-2xl" />
            </div>
            <div className="ml-3">
              <h4 className="font-semibold text-gray-700">Create a story</h4>
              <p className="text-sm text-gray-500">Share a photo or write something.</p>
            </div>
          </div>

          {/* Story List - grouped by user */}
          <ul className="space-y-3 overflow-y-auto h-5/6 scrollbar-thin scrollbar-thumb-gray-400">
            {users.slice(0, visibleStories).map((userGroup, index) => (
              <Link href={`${userGroup.stories[0]._id}`}
                key={index}
                className="flex items-center justify-between hover:bg-gray-100 transition duration-300 p-3 rounded-lg"
              >
                <div className="flex items-center cursor-pointer">
                  <div className="w-16 h-16 rounded-full border-2 border-indigo-400 bg-white p-0.5 transition transform hover:scale-105">
                    <img
                      src={userGroup.user.profilePicture}
                      alt={userGroup.user.fullName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className="flex justify-center ml-3 flex-col">
                    <h5 className="HelvB text-gray-800">
                      {userGroup.user.fullName}
                    </h5>
                    <p className="HelvR text-gray-600">{userGroup.stories[0].content.slice(0, 20)}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  {timePassed(userGroup.stories[0].createdAt)}
                </p>
              </Link>
            ))}
          </ul>

          {/* Show more/less button */}
          <button
            className="w-full mt-4 text-sm text-indigo-500 hover:text-indigo-700 transition"
            onClick={handleShowMore}
          >
            {showMore ? "Show less" : "Show more"}
          </button>
        </div>

        {/* Story Content */}
        <div className="w-2/3 flex justify-center">
          <div
            className="w-[36rem] h-screen bg-slate-800 shadow-xl rounded-r-lg relative flex flex-col justify-between items-center px-4 pb-8 pt-4 bg-cover bg-center"
            style={{ backgroundImage: `url(${storyToShow?.image})` }}
          >
            {/* Story Header */}
            <Link href={`/profile/${storyToShow?.user?._id}`} className="absolute top-7 left-4 flex items-center bg-white py-3 px-4 rounded-xl shadow-sm"
              style={{ backdropFilter: "blur(10px)", background: "rgba(255, 255, 255, 0.9)" }}
            >
              <img src={storyToShow?.user.profilePicture} alt={storyToShow?.user.fullName} className="w-10 h-10 rounded-full mr-4 object-cover" />
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{storyToShow?.user.fullName}</h3>
                <p className="text-gray-500 text-sm">{timePassed(storyToShow?.createdAt)}</p>
              </div>
            </Link>

            {/* Play/Pause Button */}
            <button
              className="absolute top-10 right-5 text-white"
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <AiOutlinePauseCircle className="w-8 h-8" />
              ) : (
                <AiOutlinePlayCircle className="w-8 h-8" />
              )}
            </button>

            {/* Story Content */}
            <motion.div
              className="absolute bottom-6 w-[95%] bg-white text-gray-800 py-2 px-6 rounded-xl shadow-md max-w-full text-center HelvR"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ backdropFilter: "blur(10px)", background: "rgba(255, 255, 255, 0.8)" }}
            >
              {storyToShow?.content}
            </motion.div>

            {/* Progress bar */}
            <div className="w-full h-[3px] relative flex space-x-1">
              {groupedStories[storyToShow.user._id].stories.map((story, index) => (
                <div
                  key={story._id}
                  className="relative h-full rounded-full overflow-hidden transition-all duration-300 cursor-pointer"
                  style={{
                    width: `${100 / groupedStories[storyToShow.user._id].stories.length}%`,
                    backgroundColor: index < currentStoryIndex ? "blue" : "gray",
                  }}
                  onClick={() => handleProgressClick(index)} // Call the handleProgressClick function
                >
                  <div
                    className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-100"
                    style={{
                      width: index === currentStoryIndex ? `${progress}%` : index < currentStoryIndex ? "100%" : "0%",
                    }}
                  />
                </div>
              ))}
            </div>


            {/* Navigation Buttons */}
            {users.findIndex((userGroup) => userGroup.user._id === storyToShow.user._id) > 0 && (
              <button
                onClick={handlePrevUser}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-1 bg-gray-300 rounded-full shadow hover:bg-gray-200 transition duration-300"
              >
                <MdChevronLeft className="text-gray-700 w-8 h-8" />
              </button>
            )}
            {users.findIndex((userGroup) => userGroup.user._id === storyToShow.user._id) < users.length - 1 && (
              <button
                onClick={handleNextUser}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 bg-gray-300 rounded-full shadow hover:bg-gray-200 transition duration-300"
              >
                <MdChevronRight className="text-gray-700 w-8 h-8" />
              </button>
            )}
          </div>
        </div>
      </div>
    </AuthRedirect>
  );
};

export default Page;
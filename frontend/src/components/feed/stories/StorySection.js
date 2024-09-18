"use client";
import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllStories } from '@/redux/story/storySlice';
import { fetchUserDetails } from '@/redux/auth/authSlice';
import Link from 'next/link';

export default function StorySection() {
  const dispatch = useDispatch();
  const { stories, loading } = useSelector((state) => state.story);
  const { isLoggedIn, userDetails } = useSelector((state) => state.auth);


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
        left: direction === 'left' ? -200 : 200,
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
    <div className="relative w-full max-w-full overflow-hidden scrollbar-hide">
      {/* Scroll buttons */}
      <button
        onClick={() => scrollStories('left')}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-white opacity-50 hover:opacity-75 shadow-lg z-10"
        style={{ marginLeft: '-5px' }} // Adjust positioning
      >
        {'<'}
      </button>
      <button
        onClick={() => scrollStories('right')}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-white opacity-50 hover:opacity-75 shadow-lg z-10"
        style={{ marginRight: '-5px' }} // Adjust positioning
      >
        {'>'}
      </button>

      <div className="p-4 bg-white rounded-lg shadow-lg overflow-x-auto scrollbar-hide" ref={scrollContainerRef}>
        <div className="flex space-x-4">
          {userDetails && <Link href='/stories' className="flex-shrink-0 flex flex-col items-center justify-center text-center cursor-pointer">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500 p-[3px]">
                <img
                  src={userDetails.profilePicture}
                  alt={userDetails.fullName}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              {/* Display a plus icon if it's the user's story */}
              <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-4 h-4 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
            </div>
            <span className="text-sm mt-2">Add Story</span>
          </Link>}
          {uniqueUserStories.map((story) => (
            <Link href={`story/${story._id}`} key={story._id} className="flex-shrink-0 flex flex-col items-center justify-center text-center cursor-pointer">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500 p-[3px]">
                  <img
                    src={story.user.profilePicture}
                    alt={story.user.fullName}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              <span className="text-sm mt-2">{story.user.fullName}</span>
            </Link>
          ))}
        </div>
        {/* Fixed blue blur effect */}
        <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
}

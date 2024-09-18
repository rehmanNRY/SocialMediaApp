"use client";
import StoryForm from '@/components/feed/stories/StoryForm';
import { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllStories } from '@/redux/story/storySlice';
import AuthRedirect from '@/components/AuthRedirect';
import Link from 'next/link';

export default function StorySection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();
  const { stories } = useSelector((state) => state.story);

  // Fetch stories on component mount
  useEffect(() => {
    dispatch(fetchAllStories());
  }, [dispatch]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
    <AuthRedirect>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 p-4">
        {/* Create Story Card */}
        <div onClick={openModal} className="cursor-pointer flex flex-col items-center justify-center w-full h-60 bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-center w-14 h-14 bg-purple-100 rounded-full">
            <FaPlus className="text-purple-500" />
          </div>
          <p className="mt-3 text-sm text-gray-700 text-center">Create Story</p>
        </div>

        {/* User Story Cards */}
        {uniqueUserStories.map((story) => (
          <Link
            key={story._id}
            href={`story/${story._id}`}
            className="relative w-full h-60 bg-cover bg-center rounded-lg shadow-lg flex flex-col justify-center items-center bg-gray-800"
            style={{ backgroundImage: `url(${story.image})` }}
          >
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full border-2 border-blue-500 bg-white p-1">
              <img
                src={story.user.profilePicture}
                alt={story.user.fullName}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            {/* Name */}
            <div className="mt-3 text-white text-sm font-medium text-center">
              {story.user.fullName}
            </div>
          </Link>
        ))}
        <StoryForm isOpen={isModalOpen} onClose={closeModal} />
      </div>
    </AuthRedirect>
  );
}

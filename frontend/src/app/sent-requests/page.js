"use client"
import React from 'react';
import { FiUserCheck, FiEye } from 'react-icons/fi';
import { motion } from 'framer-motion';

const SentRequests = () => {
  // Sample data of users to whom requests were sent
  const sentRequests = [
    {
      name: 'Ava Robinson',
      username: '@avarob',
      avatar: 'https://i.pravatar.cc/150?img=11',
      mutualFriends: 3,
    },
    {
      name: 'Ethan Lee',
      username: '@ethanl',
      avatar: 'https://i.pravatar.cc/150?img=12',
      mutualFriends: 5,
    },
    {
      name: 'Amelia Scott',
      username: '@amelias',
      avatar: 'https://i.pravatar.cc/150?img=13',
      mutualFriends: 2,
    },
    {
      name: 'Mason White',
      username: '@masonw',
      avatar: 'https://i.pravatar.cc/150?img=14',
      mutualFriends: 4,
    },
    {
      name: 'Isabella Hall',
      username: '@isabellah',
      avatar: 'https://i.pravatar.cc/150?img=15',
      mutualFriends: 6,
    },
    {
      name: 'Jacob Martinez',
      username: '@jacobm',
      avatar: 'https://i.pravatar.cc/150?img=16',
      mutualFriends: 1,
    },
    {
      name: 'Emma Lopez',
      username: '@emmal',
      avatar: 'https://i.pravatar.cc/150?img=17',
      mutualFriends: 3,
    },
    {
      name: 'Lucas Green',
      username: '@lucasg',
      avatar: 'https://i.pravatar.cc/150?img=18',
      mutualFriends: 7,
    },
  ];

  return (
    <section className="sent-requests bg-gradient-to-b from-white to-gray-100 p-8 rounded-xl shadow-xl w-full h-full">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Sent Friend Requests</h2>
      <ul className="grid grid-cols-1 gap-6">
        {sentRequests.map((user, index) => (
          <motion.li
            key={index}
            className="flex items-center justify-between p-5 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
          >
            {/* User Info */}
            <div className="flex items-center">
              <motion.img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full border-2 border-blue-500 shadow-md mr-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              />
              <div>
                <h3 className="font-semibold text-gray-700 text-lg">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.username}</p>
                <p className="text-xs text-gray-400">
                  {user.mutualFriends} mutual friends
                </p>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button className="flex items-center px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-full hover:bg-red-50 transition duration-200">
                <FiUserCheck className="mr-2 w-5 h-5" />
                Cancel
              </button>
              <button className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition duration-200">
                <FiEye className="mr-2 w-5 h-5" />
                View Profile
              </button>
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  );
};

export default SentRequests;
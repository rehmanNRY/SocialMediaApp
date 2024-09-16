import React from 'react';
import { FaUserFriends, FaUsers, FaUserPlus, FaMedal } from 'react-icons/fa';
import { motion } from 'framer-motion';

const StatsSection = ({ user }) => {
  return (
    <div className="container mx-auto px-4 py-10 bg-gray-100 rounded-lg shadow-md">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {/* Friends Section */}
        <motion.div
          className="text-center flex flex-col items-center bg-white border border-gray-200 text-gray-800 rounded-lg p-6 shadow-sm transition-transform transform hover:scale-105"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative flex items-center justify-center bg-blue-100 text-blue-600 rounded-full p-4 mb-2 shadow-sm">
            <FaUserFriends className="w-8 h-8 text-blue-500" />
            <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs rounded-full px-2 py-1">
              {user.friends.length > 99 ? '99+' : user.friends.length}
            </span>
          </div>
          <h2 className="text-3xl font-semibold text-gray-900">
            {user.friends.length}
          </h2>
          <p className="text-gray-600 font-medium">
            Friends
          </p>
        </motion.div>

        {/* Followers Section */}
        <motion.div
          className="text-center flex flex-col items-center bg-white border border-gray-200 text-gray-800 rounded-lg p-6 shadow-sm transition-transform transform hover:scale-105"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative flex items-center justify-center bg-green-100 text-green-600 rounded-full p-4 mb-2 shadow-sm">
            <FaUsers className="w-8 h-8 text-green-500" />
            <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs rounded-full px-2 py-1">
              New!
            </span>
          </div>
          <h2 className="text-3xl font-semibold text-gray-900">
            {user.followers.length}
          </h2>
          <p className="text-gray-600 font-medium">
            Followers
          </p>
        </motion.div>

        {/* Following Section */}
        <motion.div
          className="text-center flex flex-col items-center bg-white border border-gray-200 text-gray-800 rounded-lg p-6 shadow-sm transition-transform transform hover:scale-105"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative flex items-center justify-center bg-purple-100 text-purple-600 rounded-full p-4 mb-2 shadow-sm">
            <FaUserPlus className="w-8 h-8 text-purple-500" />
            <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs rounded-full px-2 py-1">
              {user.following.length > 50 ? 'Pro' : 'Rookie'}
            </span>
          </div>
          <h2 className="text-3xl font-semibold text-gray-900">
            {user.following.length}
          </h2>
          <p className="text-gray-600 font-medium">
            Following
          </p>
        </motion.div>

        {/* Badge Section */}
        <motion.div
          className="text-center flex flex-col items-center bg-white border border-gray-200 text-gray-800 rounded-lg p-6 shadow-sm transition-transform transform hover:scale-105"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative flex items-center justify-center bg-yellow-100 text-yellow-600 rounded-full p-4 mb-2 shadow-sm">
            <FaMedal className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="text-3xl font-semibold text-gray-900">
            Elite
          </h2>
          <p className="text-gray-600 font-medium">
            Badge
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default StatsSection;

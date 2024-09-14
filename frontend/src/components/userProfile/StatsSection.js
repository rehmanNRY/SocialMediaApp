import React from 'react';
import { FaUserFriends, FaUsers, FaUserPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';

const StatsSection = ({ user }) => {
  return (
    <div className="flex justify-around border-b border-gray-200 py-4">
      <motion.div
        className="text-center flex flex-col items-center"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-center bg-blue-100 rounded-full p-3 mb-2">
          <FaUserFriends className="text-blue-500 w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">{user.friends.length}</h2>
        <p className="text-gray-600 font-medium">Friends</p>
      </motion.div>
      
      <motion.div
        className="text-center flex flex-col items-center"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-center bg-green-100 rounded-full p-3 mb-2">
          <FaUsers className="text-green-500 w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">{user.followers.length}</h2>
        <p className="text-gray-600 font-medium">Followers</p>
      </motion.div>

      <motion.div
        className="text-center flex flex-col items-center"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-center bg-yellow-100 rounded-full p-3 mb-2">
          <FaUserPlus className="text-yellow-500 w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">{user.following.length}</h2>
        <p className="text-gray-600 font-medium">Following</p>
      </motion.div>
    </div>
  );
};

export default StatsSection;
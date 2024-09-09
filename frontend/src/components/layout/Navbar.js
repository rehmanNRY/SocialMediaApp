import React from 'react';
import { FiSearch, FiMessageSquare, FiBell } from 'react-icons/fi';
import { AiOutlineHome, AiOutlineSetting, AiOutlineUsergroupAdd } from 'react-icons/ai';
import { BsBriefcase, BsThreeDotsVertical } from 'react-icons/bs';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <div className="h-16 relative z-10">
      <header className="h-16 bg-white shadow-lg border-b border-gray-200 flex items-center justify-between px-4 fixed w-full box-border">
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          <motion.div
            className="text-2xl font-extrabold text-blue-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            MySocial
          </motion.div>
          <nav className="hidden sm:flex space-x-6">
            <a href="#" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition transform hover:scale-110">
              <AiOutlineHome className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </a>
            <a href="#" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition transform hover:scale-110">
              <BsBriefcase className="w-5 h-5" />
              <span className="font-medium">Jobs</span>
            </a>
            <a href="#" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition transform hover:scale-110">
              <AiOutlineUsergroupAdd className="w-5 h-5" />
              <span className="font-medium">Connections</span>
            </a>
          </nav>
        </div>

        {/* Middle Section */}
        <div className="flex-grow hidden sm:flex items-center mx-6 relative">
          <FiSearch className="absolute left-4 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for people, posts..."
            className="w-full pl-12 pr-4 py-2 rounded-full bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition duration-300"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          <a href="#" className="relative">
            <FiMessageSquare className="w-6 h-6 text-gray-700 hover:text-blue-600 transition transform hover:scale-110" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
          </a>
          <a href="#" className="relative">
            <FiBell className="w-6 h-6 text-gray-700 hover:text-blue-600 transition transform hover:scale-110" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
          </a>
          <motion.div
            className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            JD
          </motion.div>
          <a href="#" className="text-gray-700 hover:text-blue-600 transition transform hover:scale-110">
            <BsThreeDotsVertical className="w-6 h-6" />
          </a>
          <a href="#" className="hidden sm:flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition transform hover:scale-110">
            <AiOutlineSetting className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </a>
        </div>
      </header>
    </div>
  );
};

export default Header;

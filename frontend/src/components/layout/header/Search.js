"use client";
import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSelector } from 'react-redux';

const Search = ({ isMobile = false, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  
  const searchMenuRef = useRef(null);
  const inputRef = useRef(null);
  
  const users = useSelector((state) => state.users.users);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Automatically show menu when typing in desktop mode
    if (!isMobile) {
      setShowMenu(true);
    }
  };

  const highlightMatch = (name, searchTerm) => {
    if (!searchTerm.trim()) return name;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return name.split(regex).map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} className="bg-indigo-100 text-indigo-800 rounded-sm px-0.5">{part}</span>
      ) : (
        part
      )
    );
  };

  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClickOutside = (e) => {
    if (searchMenuRef.current && !searchMenuRef.current.contains(e.target) &&
      inputRef.current && !inputRef.current.contains(e.target)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (isMobile) {
    // Mobile Search UI
    return (
      <motion.div
        className="fixed inset-0 bg-white z-50 flex flex-col md:hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center p-3 border-b border-gray-200">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="text-gray-500 p-2 rounded-full hover:bg-gray-100 mr-2"
            onClick={onClose}
          >
            <FiX className="w-5 h-5" />
          </motion.button>
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              autoFocus
              ref={inputRef}
              placeholder="Search for people, posts..."
              className="w-full pl-10 pr-10 py-2 rounded-full bg-gray-100 focus:bg-white focus:ring-2 focus:ring-indigo-300 border-none"
            />
            {searchTerm && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setSearchTerm('')}
              >
                <FiX className="text-gray-400 w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-grow overflow-y-auto">
          <div className="p-3 border-b border-gray-100">
            <h5 className="font-semibold text-sm text-gray-700">People</h5>
          </div>

          <div className="p-2">
            {(searchTerm ? filteredUsers : users).length > 0 ? (
              <>
                {(searchTerm ? filteredUsers : users.slice(0, 10)).map((user) => (
                  <Link
                    href={`profile/${user._id}`}
                    key={user._id}
                    className="flex items-center p-2 rounded-xl hover:bg-gray-50 transition-colors"
                    onClick={onClose}
                  >
                    <div className="relative">
                      <img
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                        src={user?.profilePicture}
                        alt={user?.fullName}
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div className="ml-3">
                      <h5 className="font-medium text-gray-900 flex flex-wrap items-center">
                        {highlightMatch(user.fullName, searchTerm)}
                        <span className="ml-2 px-1.5 py-0.5 text-xs rounded-md bg-gray-100 text-gray-500">@{user.username.toLowerCase()}</span>
                      </h5>
                      <p className="text-gray-500 text-xs truncate">{user.bio}</p>
                    </div>
                  </Link>
                ))}
              </>
            ) : (
              <div className="p-4 text-center">
                <p className="text-gray-500">No users found</p>
                <button className="mt-2 text-indigo-600 font-medium">Browse all users</button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Desktop Search UI
  return (
    <div className="hidden md:flex flex-grow items-center mx-4 relative" ref={searchMenuRef}>
      <div className="relative w-full group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400 w-5 h-5 group-hover:text-indigo-500 transition-colors duration-200" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onClick={() => setShowMenu(true)}
          ref={inputRef}
          placeholder="Search people, posts, topics..."
          className="w-full pl-10 pr-4 py-2.5 rounded-full bg-gray-100 focus:bg-white focus:ring-2 focus:ring-indigo-300 border-none transition duration-300 placeholder:text-gray-400 group-hover:bg-gray-200 group-hover:shadow-sm"
        />
        {searchTerm && (
          <button
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setSearchTerm('')}
          >
            <FiX className="text-gray-400 w-4 h-4 hover:text-gray-600" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute w-full bg-white top-12 rounded-xl shadow-2xl border border-gray-100 py-3 overflow-hidden"
          >
            <div className="px-3 pb-2 border-b border-gray-100">
              <h5 className="font-semibold text-sm text-gray-700">People</h5>
            </div>
            <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50">
              {(searchTerm ? filteredUsers : users).length > 0 ? (
                <>
                  {(searchTerm ? filteredUsers : users.slice(0, 6)).map((user) => (
                    <Link href={`profile/${user._id}`} key={user._id} className="flex hover:bg-gray-50 items-center py-2 px-3 transition-colors">
                      <div className="relative">
                        <img
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                          src={user?.profilePicture}
                          alt={user?.fullName}
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                      </div>
                      <div className="ml-3">
                        <h5 className="font-medium text-gray-900 flex items-center text-sm">
                          {highlightMatch(user.fullName, searchTerm)}
                          <span className="ml-2 px-1.5 py-0.5 text-xs rounded-md bg-gray-100 text-gray-500">@{user.username.toLowerCase()}</span>
                        </h5>
                        <p className="text-gray-500 text-xs truncate max-w-xs">{user.bio}</p>
                      </div>
                    </Link>
                  ))}
                </>
              ) : (
                <div className="px-3 py-4 text-center">
                  <p className="text-gray-500 text-sm">No users found</p>
                  <button className="mt-2 text-indigo-600 text-sm font-medium hover:underline">Browse all users</button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Search;
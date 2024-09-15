"use client"
import React, { useEffect, useState, useRef } from 'react';
import { FiSearch, FiHome, FiSettings, FiUserPlus, FiUser } from 'react-icons/fi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDetails } from '@/redux/auth/authSlice';
import Link from 'next/link';
import { fetchUsers } from '@/redux/users/usersSlice';

const Header = () => {
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const searchMenuRef = useRef(null);  // Ref for search menu container
  const inputRef = useRef(null);       // Ref for search input

  const users = useSelector((state) => state.users.users);
  const { isLoggedIn, userDetails } = useSelector((state) => state.auth);

  useEffect(() => {
    setIsClient(true);
    dispatch(fetchUsers());
    if (isLoggedIn) {
      dispatch(fetchUserDetails());
    }
  }, [isLoggedIn, dispatch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const highlightMatch = (name, searchTerm) => {
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return name.split(regex).map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} className="bg-yellow-300">{part}</span>
      ) : (
        part
      )
    );
  };

  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClickOutside = (e) => {
    // Close the menu if the click happens outside the search input or menu
    if (searchMenuRef.current && !searchMenuRef.current.contains(e.target) && inputRef.current && !inputRef.current.contains(e.target)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <>
      {isLoggedIn && (
        <div className="h-[4.5rem] relative z-10">
          <header className="h-[4.5rem] bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6 fixed w-full box-border">
            {/* Left Section */}
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center">
                <img
                  src="/images/rehman_logo.png"
                  alt="Logo"
                  className="w-8 mr-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                />
                <span className="font-medium text-lg">Rehman</span>
              </Link>
              <nav className="hidden lg:flex space-x-6">
                <Link href="/" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                  <FiHome className="w-5 h-5 text-blue-500 mr-1" />
                  <span className="font-medium">Home</span>
                </Link>
                <Link href={`profile/${userDetails?._id}`} className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                  <FiUser className="w-5 h-5 text-green-500 mr-1" />
                  <span className="font-medium">Profile</span>
                </Link>
                <Link href="/friends" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                  <FiUserPlus className="w-5 h-5 text-pink-500 mr-1" />
                  <span className="font-medium">Connections</span>
                </Link>
              </nav>
            </div>

            {/* Middle Section */}
            <div className="flex-grow hidden sm:flex items-center mx-6 relative" ref={searchMenuRef}>
              <FiSearch className="absolute left-4 text-gray-500 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onClick={() => setShowMenu(true)}
                ref={inputRef}
                placeholder="Search for people, posts..."
                className="w-full pl-12 pr-4 py-2 rounded-md bg-[#F5F6FA] focus:bg-gray-100 transition duration-300 focus:outline-none border border-gray-100"
              />
              {showMenu && (
                <div className="absolute w-full bg-gray-50 top-12 rounded-md shadow-lg border-gray-200 py-4 px-2">
                  <h5 className="ml-2 font-semibold mb-2">People</h5>
                  <ul>
                    {(searchTerm ? filteredUsers : users).length > 0 ? <>
                      {(searchTerm ? filteredUsers : users).map((user) => (
                        <li key={user._id} className="flex hover:bg-white items-center py-2 px-3 rounded-lg my-0.5">
                          <img
                            className="mr-2 w-10 h-10 rounded-full bg-gray-300 object-cover shadow-sm"
                            src={user?.profilePicture}
                            alt={user?.fullName}
                          />
                          <span>{highlightMatch(user.fullName, searchTerm)}</span>
                        </li>
                      ))}
                    </> : <p className="ml-2">No Users to show</p>}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              <Link href={`profile/${userDetails?._id}`} className="font-semibold flex items-center hover:text-blue-600">
                <motion.img
                  className="mr-2 w-10 h-10 rounded-full bg-gray-300 object-cover"
                  src={userDetails?.profilePicture}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  alt={userDetails?.fullName}
                />
                <span>{userDetails?.fullName}</span>
              </Link>
              <button className="text-gray-700 hover:text-blue-600">
                <BsThreeDotsVertical className="w-5 h-5" />
              </button>
              <Link href="/settings" className="hidden sm:flex items-center text-gray-700 hover:text-blue-600">
                <FiSettings className="w-5 h-5 mr-1.5 text-indigo-500" />
                <span className="font-medium">Settings</span>
              </Link>
            </div>
          </header>
        </div>
      )}
    </>
  );
};

export default Header;
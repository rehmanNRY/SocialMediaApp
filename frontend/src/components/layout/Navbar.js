"use client";
import React, { useEffect, useState, useRef } from 'react';
import { FiSearch, FiHome, FiSettings, FiUserPlus, FiUser } from 'react-icons/fi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDetails } from '@/redux/auth/authSlice';
import Link from 'next/link';
import { fetchUsers } from '@/redux/users/usersSlice';

const Header = ({toggleSidebar}) => {
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false); // New state for mobile search menu

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
        <span key={index} className="bg-indigo-100 text-indigo-800">{part}</span>
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
          <header className="h-[4.5rem] bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-4 md:px-6 fixed w-full box-border">
            {/* Left Section */}
            <div className="flex items-center space-x-2 md:space-x-5">
              <Link href="/" className="flex items-center">
                <img
                  src="/images/rehman_logo.png"
                  alt="Logo"
                  className="w-6 md:w-8 mr-1 md:mr-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                />
                <span className="font-medium text-md md:text-lg">Rehman</span>
              </Link>
              <nav className="hidden lg:flex space-x-3 md:space-x-5">
                <Link href={`profile/${userDetails?._id}`} className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                  <FiUser className="w-4 h-4 md:w-5 md:h-5 text-green-500 mr-1" />
                  <span className="font-medium text-sm md:text-base">Profile</span>
                </Link>
                <Link href="/friends" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                  <FiUserPlus className="w-4 h-4 md:w-5 md:h-5 text-pink-500 mr-1" />
                  <span className="font-medium text-sm md:text-base">Connections</span>
                </Link>
              </nav>
            </div>

            {/* Middle Section */}
            <div className="hidden md:flex flex-grow items-center mx-6 relative" ref={searchMenuRef}>
              <FiSearch className="absolute left-4 text-gray-500 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onClick={() => setShowMenu(true)}
                ref={inputRef}
                placeholder="Search for people, posts..."
                className="w-full pl-12 pr-4 py-2 rounded-md bg-[#F5F6FA] focus:bg-gray-100 transition duration-300 focus:outline-none border border-gray-100 focus:border-indigo-400"
              />
              {showMenu && (
                <div className="absolute w-full bg-white top-12 rounded-lg shadow-2xl border border-gray-300 py-4 px-2">
                  <h5 className="ml-2 font-semibold mb-2">People</h5>
                  <ul>
                    {(searchTerm ? filteredUsers : users).length > 0 ? (
                      <>
                        {(searchTerm ? filteredUsers : users.slice(0, 6)).map((user) => (
                          <Link href={`profile/${user._id}`} key={user._id} className="flex hover:bg-white items-center py-2 px-3 rounded-lg my-0.5">
                            <img
                              className="mr-2 w-10 h-10 rounded-full bg-gray-300 object-cover shadow-sm"
                              src={user?.profilePicture}
                              alt={user?.fullName}
                            />
                            <div>
                              <h5 className='HelvM flex'>
                                {highlightMatch(user.fullName, searchTerm)}
                                <span className='shadow-sm bg-gray-100 rounded-md text-gray-600 px-2 ml-2 text-sm HelvR flex items-center'>@{user.username.toLowerCase()}</span>
                              </h5>
                              <p className='HelvR text-gray-700 text-sm'>{user.bio}</p>
                            </div>
                          </Link>
                        ))}
                      </>
                    ) : (
                      <p className="ml-2">No Users to show</p>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3 md:space-x-4">
              <Link href={`profile/${userDetails?._id}`} className="flex items-center hover:text-blue-600">
                <motion.img
                  className="mr-2 w-8 md:w-10 h-8 md:h-10 rounded-full bg-gray-300 object-cover"
                  src={userDetails?.profilePicture}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  alt={userDetails?.fullName}
                />
                <span className='hidden lg:block HelvM text-base tracking-[0.5px]'>{userDetails?.fullName}</span>
              </Link>
              <button
                className="text-gray-700 hover:text-blue-600 md:hidden"
                onClick={() => setShowMobileSearch(true)}
              >
                <FiSearch className="w-5 h-5" />
              </button>
              <button className="text-gray-700 hover:text-blue-600" onClick={toggleSidebar}>
                <BsThreeDotsVertical className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <Link href="/settings" className="hidden md:flex items-center text-gray-700 hover:text-blue-600">
                <FiSettings className="w-5 h-5 mr-1.5 text-indigo-500" />
                <span className="font-medium text-base lg:block hidden">Settings</span>
              </Link>
            </div>
          </header>

          {/* Mobile Search Menu */}
          {showMobileSearch && (
            <div className="fixed inset-0 bg-white z-50 flex flex-col md:hidden">
              <div className="flex items-center px-2.5 py-2 border-b border-gray-200">
                <button
                  className="text-gray-700 hover:text-blue-600 mr-1"
                  onClick={() => setShowMobileSearch(false)}
                >
                  Close
                </button>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  ref={inputRef}
                  placeholder="Search for people, posts..."
                  className="w-full pl-4 py-2 rounded-md bg-[#F5F6FA] focus:bg-gray-100 transition duration-300 focus:outline-none border border-gray-100 focus:border-indigo-400"
                />
              </div>
              <div className="flex-grow overflow-y-auto">
                <div className="py-4 px-2">
                  <h5 className="ml-2 font-semibold mb-2">People</h5>
                  <ul>
                    {(searchTerm ? filteredUsers : users).length > 0 ? (
                      <>
                        {(searchTerm ? filteredUsers : users.slice(0, 6)).map((user) => (
                          <Link href={`profile/${user._id}`} key={user._id} className="flex hover:bg-gray-100 items-center py-2 px-3 rounded-lg my-0.5">
                            <img
                              className="mr-2 w-10 h-10 rounded-full bg-gray-300 object-cover shadow-sm"
                              src={user?.profilePicture}
                              alt={user?.fullName}
                            />
                            <div>
                              <h5 className='HelvM flex'>
                                {highlightMatch(user.fullName, searchTerm)}
                                <span className='shadow-sm bg-gray-100 rounded-md text-gray-600 px-2 ml-2 text-sm HelvR flex items-center'>@{user.username.toLowerCase()}</span>
                              </h5>
                              <p className='HelvR text-gray-700 text-sm'>{user.bio}</p>
                            </div>
                          </Link>
                        ))}
                      </>
                    ) : (
                      <p className="ml-2">No Users to show</p>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Header;

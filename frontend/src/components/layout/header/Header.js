"use client";
import React, { useEffect, useState, useRef } from 'react';
import { FiSearch, FiHome, FiSettings, FiUserPlus, FiUser, FiBell, FiMenu } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDetails } from '@/redux/auth/authSlice';
import { fetchUsers } from '@/redux/users/usersSlice';
import { IoRocketOutline } from 'react-icons/io5';
import Search from './Search';
import Notification from './Notification';
import { useLoading } from '@/components/LoadingProvider';
import { useRouter } from 'next/navigation';
import ProfileMenu from './ProfileMenu';
import Link from 'next/link';

const Header = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { showLoadingFor } = useLoading();
  const [isClient, setIsClient] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoverNav, setHoverNav] = useState(null);

  const { isLoggedIn, userDetails } = useSelector((state) => state.auth);

  // Custom navigation function to show loading state
  const handleNavigation = (path) => {
    showLoadingFor(500); // Show loading for 500ms
    router.push(path);
  };

  useEffect(() => {
    setIsClient(true);
    dispatch(fetchUsers());
    if (isLoggedIn) {
      dispatch(fetchUserDetails());
    }

    // Add scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoggedIn, dispatch]);

  if (!isClient) {
    return null;
  }

  return (
    <>
      {isLoggedIn && (
        <div className="h-16 relative z-30">
          <motion.header
            className={`h-16 backdrop-blur-lg border-b border-gray-100 transition-all duration-300 flex items-center justify-between px-4 md:px-6 fixed w-full top-0 ${scrolled
              ? "bg-white/90 shadow-md"
              : "bg-white/95 shadow-sm"
              }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            {/* Left Section - Logo & Nav Links */}
            <div className="flex items-center">
              <div
                onClick={() => handleNavigation('/')}
                className="flex items-center group cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="relative"
                >
                  <img
                    src="/images/rehman_logo.png"
                    alt="Logo"
                    className="w-9 h-9 rounded-lg mr-2 z-10 relative drop-shadow-md"
                  />
                  <motion.div
                    className="absolute inset-0 bg-indigo-400/20 rounded-lg blur-md"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 0.4, 0.7]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                </motion.div>
                <span className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-indigo-600 transition-all duration-500">Rehman</span>
              </div>

              <nav className="hidden lg:flex ml-3">
                <div
                  onClick={() => handleNavigation('/')}
                  className="relative flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-colors duration-200 py-1 px-3 rounded-full hover:bg-indigo-50 group cursor-pointer"
                  onMouseEnter={() => setHoverNav('home')}
                  onMouseLeave={() => setHoverNav(null)}
                >
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <FiHome className="w-5 h-5 text-indigo-500 group-hover:text-indigo-600" />
                  </motion.div>
                  <span className="font-medium">Home</span>
                  {hoverNav === 'home' && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full"
                      initial={{ width: 0, left: "50%", right: "50%" }}
                      animate={{ width: "100%", left: 0, right: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </div>

                <div
                  onClick={() => handleNavigation(`/profile/${userDetails?._id}`)}
                  className="relative flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors duration-200 py-1 px-3 rounded-full hover:bg-green-50 group cursor-pointer"
                  onMouseEnter={() => setHoverNav('profile')}
                  onMouseLeave={() => setHoverNav(null)}
                >
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <FiUser className="w-5 h-5 text-green-500 group-hover:text-green-600" />
                  </motion.div>
                  <span className="font-medium">Profile</span>
                  {hoverNav === 'profile' && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500 rounded-full"
                      initial={{ width: 0, left: "50%", right: "50%" }}
                      animate={{ width: "100%", left: 0, right: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </div>

                <div
                  onClick={() => handleNavigation('/friends')}
                  className="relative flex items-center space-x-2 text-gray-700 hover:text-pink-600 transition-colors duration-200 py-1 px-3 rounded-full hover:bg-pink-50 group cursor-pointer"
                  onMouseEnter={() => setHoverNav('connections')}
                  onMouseLeave={() => setHoverNav(null)}
                >
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <FiUserPlus className="w-5 h-5 text-pink-500 group-hover:text-pink-600" />
                  </motion.div>
                  <span className="font-medium">Connections</span>
                  {hoverNav === 'connections' && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500 rounded-full"
                      initial={{ width: 0, left: "50%", right: "50%" }}
                      animate={{ width: "100%", left: 0, right: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </div>

                <div
                  onClick={() => handleNavigation('/explore')}
                  className="relative flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors duration-200 py-1 px-3 rounded-full hover:bg-purple-50 group cursor-pointer"
                  onMouseEnter={() => setHoverNav('explore')}
                  onMouseLeave={() => setHoverNav(null)}
                >
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <IoRocketOutline className="w-5 h-5 text-purple-500 group-hover:text-purple-600" />
                  </motion.div>
                  <span className="font-medium">Explore</span>
                  {hoverNav === 'explore' && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full"
                      initial={{ width: 0, left: "50%", right: "50%" }}
                      animate={{ width: "100%", left: 0, right: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </div>
              </nav>
            </div>

            {/* Middle Section - Search */}
            <Search />

            {/* Right Section - User & Actions */}
            <div className="flex items-center space-x-1 md:space-x-3">
              {/* Notifications */}
              <Notification />

              {/* Settings */}
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  onClick={() => handleNavigation('/settings')}
                  className="hidden md:flex p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <FiSettings className="w-5 h-5 text-gray-700" />
                </div>
              </motion.div>

              {/* Mobile Search Trigger */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => setShowMobileSearch(true)}
              >
                <FiSearch className="w-5 h-5 text-gray-700" />
              </motion.button>

              {/* User Profile */}
              <ProfileMenu userDetails={userDetails} />

              {/* Menu Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors md:hidden"
                onClick={toggleSidebar}
              >
                <FiMenu className="w-5 h-5 text-gray-700" />
              </motion.button>
              <a
                href={"https://github.com/rehmanNRY/SocialMediaApp/fork"}
                target='_blank'
                className="p-2 rounded-full hover:bg-gray-100 transition-colors md:block hidden"
              >
                <img src='https://cdn-icons-png.flaticon.com/512/25/25231.png' className="w-6 h-6" />
              </a>
            </div>
          </motion.header>

          {/* Mobile Search Overlay */}
          <AnimatePresence>
            {showMobileSearch && (
              <Search isMobile={true} onClose={() => setShowMobileSearch(false)} />
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
};

export default Header;
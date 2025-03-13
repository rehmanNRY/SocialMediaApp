"use client";
import React, { useEffect, useState, useRef } from 'react';
import { FiSearch, FiHome, FiSettings, FiUserPlus, FiUser, FiBell, FiMenu } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDetails } from '@/redux/auth/authSlice';
import Link from 'next/link';
import { fetchUsers } from '@/redux/users/usersSlice';
import { IoRocketOutline, IoSettings, IoSettingsOutline } from 'react-icons/io5';
import Search from './Search';
import Notification from './Notification';
import { useLoading } from '@/components/LoadingProvider';
import { useRouter } from 'next/navigation';
import { logout } from '@/redux/auth/authSlice';
import { BiBookmark, BiChevronDown, BiHelpCircle, BiLogOut } from 'react-icons/bi';

const Header = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { showLoadingFor } = useLoading();
  const [isClient, setIsClient] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoverNav, setHoverNav] = useState(null);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

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

  const handleClickOutside = (event) => {
    if (showUserMenu && userMenuRef.current && !userMenuRef.current.contains(event.target)) {
      setShowUserMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUserMenu]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Escape to close user menu
      if (e.key === 'Escape' && showUserMenu) {
        setShowUserMenu(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showUserMenu]);


  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

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
              <div className="relative z-30" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 py-2 px-4 rounded-full bg-white hover:bg-gray-50 group transition-all duration-300 shadow-sm hover:shadow border border-transparent hover:border-indigo-100"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-violet-500 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300"></div>
                    <img
                      src={userDetails?.profilePicture}
                      alt={userDetails?.fullName}
                      className="w-9 h-9 rounded-full border-2 border-white shadow-sm group-hover:shadow-md transition-all relative z-10"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white z-20" />
                  </div>
                  <div className="flex flex-col items-start">
                    <h3 className="font-medium text-gray-800 transition-colors duration-200 group-hover:text-indigo-700 max-w-32 truncate text-sm">
                      {userDetails?.fullName?.split(' ')[0] || "User"}
                    </h3>
                    <span className="text-xs text-gray-500 group-hover:text-indigo-500">Online</span>
                  </div>
                  <BiChevronDown className={`w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-all duration-300 ${showUserMenu ? 'rotate-180 text-indigo-600' : ''}`} />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
                      className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 overflow-hidden"
                    >
                      <div className="px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-violet-50">
                        <div className="flex items-center gap-3">
                          <img
                            src={userDetails?.profilePicture}
                            alt={userDetails?.fullName}
                            className="w-12 h-12 rounded-full border-2 border-white shadow"
                          />
                          <div>
                            <p className="text-base font-semibold text-gray-900">{userDetails?.fullName || "User"}</p>
                            <p className="text-xs text-gray-600 truncate">{userDetails?.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="py-2 px-1">
                        <Link
                          href={`/profile/${userDetails?._id}`}
                          className="flex items-center mx-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors duration-200"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <div className="w-8 h-8 flex items-center justify-center bg-indigo-100 rounded-lg mr-3 text-indigo-600">
                            <FiUser className="w-4 h-4" />
                          </div>
                          <span>Your Profile</span>
                        </Link>
                        <Link
                          href="/bookmarks"
                          className="flex items-center mx-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors duration-200"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-lg mr-3 text-blue-600">
                            <BiBookmark className="w-4 h-4" />
                          </div>
                          <span>Bookmarks</span>
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center mx-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors duration-200"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <div className="w-8 h-8 flex items-center justify-center bg-purple-100 rounded-lg mr-3 text-purple-600">
                            <IoSettingsOutline className="w-4 h-4" />
                          </div>
                          <span>Settings</span>
                        </Link>
                        <Link
                          href="/contact"
                          className="flex items-center mx-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors duration-200"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <div className="w-8 h-8 flex items-center justify-center bg-teal-100 rounded-lg mr-3 text-teal-600">
                            <BiHelpCircle className="w-4 h-4" />
                          </div>
                          <span>Help Center</span>
                        </Link>
                      </div>

                      <div className="mt-1 px-3">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <div className="w-8 h-8 flex items-center justify-center bg-red-100 rounded-lg mr-3 text-red-500">
                            <BiLogOut className="w-4 h-4" />
                          </div>
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Menu Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={toggleSidebar}
              >
                <FiMenu className="w-5 h-5 text-gray-700" />
              </motion.button>
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
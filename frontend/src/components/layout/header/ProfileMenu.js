"use client"
import React, { useEffect, useRef, useState } from 'react'
import { BiBookmark, BiChevronDown, BiHelpCircle, BiLogOut } from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/auth/authSlice';
import { IoSettingsOutline, IoNotificationsOutline, IoWalletOutline } from 'react-icons/io5';
import { FiUser, FiCreditCard, FiMessageCircle, FiMoon, FiSun } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const ProfileMenu = ({ userDetails }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
  const [darkMode, setDarkMode] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const userMenuRef = useRef(null);
  const buttonRef = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();

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

      // Toggle menu with keyboard shortcut
      if (e.key === '/' && e.ctrlKey) {
        setShowUserMenu(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showUserMenu]);

  // Calculate menu position for nice animation
  useEffect(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({ x: rect.right - 320, y: rect.bottom + 10 });
    }
  }, [showUserMenu]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  // Animation variants
  const menuVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      transformOrigin: "top right" 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        duration: 0.4, 
        stiffness: 200, 
        damping: 15 
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      transition: { 
        duration: 0.2 
      } 
    }
  };

  const avatarPulse = {
    pulse: {
      scale: [1, 1.05, 1],
      boxShadow: [
        "0 0 0 0 rgba(99, 102, 241, 0)",
        "0 0 0 6px rgba(99, 102, 241, 0.2)",
        "0 0 0 0 rgba(99, 102, 241, 0)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop"
      }
    }
  };

  const iconVariants = {
    hover: {
      rotate: 15,
      scale: 1.2,
      transition: { duration: 0.3 }
    }
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.98 }
  };

  const tabs = [
    { id: 'account', label: 'Account' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <div className="relative z-30" ref={userMenuRef}>
      <motion.button
        ref={buttonRef}
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="flex items-center gap-2 py-1 px-2 rounded-full bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-md"
        whileTap="tap"
        variants={buttonVariants}
        initial="rest"
      >
        <motion.div 
          className="relative"
        >
          <motion.div 
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm"
          >
            <img
              src={userDetails?.profilePicture || "https://via.placeholder.com/100"}
              alt={userDetails?.fullName || "User"}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        </motion.div>
        
        <motion.div 
          className={`flex items-center gap-1 ${showUserMenu ? 'text-indigo-600' : 'text-gray-700'}`}
          animate={{ color: showUserMenu ? '#4f46e5' : '#374151' }}
        >
          <BiChevronDown 
            className={`w-5 h-5 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} 
          />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {showUserMenu && (
          <motion.div
            className="fixed right-4 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ top: menuPosition.y }}
          >
            {/* Header with user info */}
            <div className="p-5 border-b border-gray-100 relative overflow-hidden">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 opacity-70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
              />
              
              <div className="relative flex items-center gap-4">
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={userDetails?.profilePicture || "https://via.placeholder.com/100"}
                    alt={userDetails?.fullName || "User"}
                    className="w-16 h-16 rounded-full border-2 border-white shadow-md object-cover"
                  />
                  <motion.div 
                    className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </motion.div>
                
                <div>
                  <motion.p 
                    className="text-lg font-semibold text-gray-900"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {userDetails?.fullName || "User"}
                  </motion.p>
                  <motion.p 
                    className="text-sm text-gray-600 truncate max-w-[180px]"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {userDetails?.email || "user@example.com"}
                  </motion.p>
                </div>
              </div>
            </div>

            {/* Tab navigation */}
            <div className="flex border-b border-gray-100">
              {tabs.map(tab => (
                <motion.button
                  key={tab.id}
                  className={`flex-1 py-3 text-sm font-medium ${
                    activeTab === tab.id 
                      ? 'text-indigo-600 border-b-2 border-indigo-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ backgroundColor: 'rgba(238, 242, 255, 0.5)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  {tab.label}
                </motion.button>
              ))}
            </div>

            {/* Content based on active tab */}
            <AnimatePresence mode="wait">
              {activeTab === 'account' && (
                <motion.div
                  key="account"
                  className="py-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={`/profile/${userDetails?._id}`}
                    className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <motion.div 
                      className="w-9 h-9 flex items-center justify-center bg-indigo-100 rounded-xl mr-3 text-indigo-600"
                      variants={iconVariants}
                      whileHover="hover"
                    >
                      <FiUser className="w-5 h-5" />
                    </motion.div>
                    <span>Your Profile</span>
                  </Link>
                  
                  <Link
                    href="/bookmarks"
                    className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <motion.div 
                      className="w-9 h-9 flex items-center justify-center bg-blue-100 rounded-xl mr-3 text-blue-600"
                      variants={iconVariants}
                      whileHover="hover"
                    >
                      <BiBookmark className="w-5 h-5" />
                    </motion.div>
                    <span>Saved Items</span>
                  </Link>
                  
                  <Link
                    href="/notifications"
                    className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-200"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <motion.div 
                      className="w-9 h-9 flex items-center justify-center bg-purple-100 rounded-xl mr-3 text-purple-600 relative"
                      variants={iconVariants}
                      whileHover="hover"
                    >
                      <IoNotificationsOutline className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                        3
                      </span>
                    </motion.div>
                    <span>Notifications</span>
                  </Link>
                  
                  <Link
                    href="/wallet"
                    className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-200"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <motion.div 
                      className="w-9 h-9 flex items-center justify-center bg-emerald-100 rounded-xl mr-3 text-emerald-600"
                      variants={iconVariants}
                      whileHover="hover"
                    >
                      <IoWalletOutline className="w-5 h-5" />
                    </motion.div>
                    <span>Wallet</span>
                  </Link>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  className="py-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href="/settings"
                    className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <motion.div 
                      className="w-9 h-9 flex items-center justify-center bg-indigo-100 rounded-xl mr-3 text-indigo-600"
                      variants={iconVariants}
                      whileHover="hover"
                    >
                      <IoSettingsOutline className="w-5 h-5" />
                    </motion.div>
                    <span>Account Settings</span>
                  </Link>
                  
                  <Link
                    href="/payments"
                    className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors duration-200"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <motion.div 
                      className="w-9 h-9 flex items-center justify-center bg-amber-100 rounded-xl mr-3 text-amber-600"
                      variants={iconVariants}
                      whileHover="hover"
                    >
                      <FiCreditCard className="w-5 h-5" />
                    </motion.div>
                    <span>Payment Methods</span>
                  </Link>
                  
                  <Link
                    href="/contact"
                    className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <motion.div 
                      className="w-9 h-9 flex items-center justify-center bg-teal-100 rounded-xl mr-3 text-teal-600"
                      variants={iconVariants}
                      whileHover="hover"
                    >
                      <FiMessageCircle className="w-5 h-5" />
                    </motion.div>
                    <span>Help & Support</span>
                  </Link>
                  
                  <button
                    className="flex w-full items-center px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setDarkMode(!darkMode)}
                  >
                    <motion.div 
                      className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-xl mr-3 text-gray-600"
                      variants={iconVariants}
                      whileHover="hover"
                    >
                      {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                    </motion.div>
                    <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                    
                    <div className="ml-auto">
                      <motion.div 
                        className={`w-10 h-6 rounded-full p-1 flex items-center ${darkMode ? 'bg-indigo-600' : 'bg-gray-300'}`}
                        animate={{ backgroundColor: darkMode ? '#4f46e5' : '#d1d5db' }}
                      >
                        <motion.div 
                          className="w-4 h-4 rounded-full bg-white shadow-sm"
                          animate={{ x: darkMode ? 16 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </motion.div>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer with logout */}
            <div className="mt-1 px-3 py-3 border-t border-gray-100">
              <motion.button
                onClick={handleLogout}
                className="flex w-full items-center px-3 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors duration-200"
                whileHover={{ scale: 1.02, backgroundColor: "rgba(254, 226, 226, 0.6)" }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div 
                  className="w-9 h-9 flex items-center justify-center bg-red-100 rounded-xl mr-3 text-red-600"
                  variants={iconVariants}
                  whileHover="hover"
                >
                  <BiLogOut className="w-5 h-5" />
                </motion.div>
                <span>Sign Out</span>
              </motion.button>
              
              <div className="mt-3 text-xs text-center text-gray-400">
                <p>Press <kbd className="px-2 py-1 bg-gray-100 rounded-md">Ctrl</kbd> + <kbd className="px-2 py-1 bg-gray-100 rounded-md">/</kbd> to toggle menu</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProfileMenu
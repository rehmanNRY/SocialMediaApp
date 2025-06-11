"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { performLogout, clearAuthState } from '@/redux/auth/authSlice'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

// React Icons imports (replacing Lucide)
import {
  FaBookmark,
  FaUser,
  FaSignOutAlt,
  FaBell,
  FaCommentAlt,
  FaBolt,
  FaChartLine,
  FaChevronDown,
  FaTimes,
  FaKeyboard
} from 'react-icons/fa'
import { IoSettingsSharp } from 'react-icons/io5'
import { BsFillCircleFill } from 'react-icons/bs'
import ModalPortal from '@/components/common/ModalPortal'

const ProfileMenu = ({ userDetails }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('main')
  const [animation, setAnimation] = useState('pulse')
  const menuRef = useRef(null)
  const buttonRef = useRef(null)
  const router = useRouter()
  const dispatch = useDispatch()

  const handleClickOutside = (event) => {
    if (isOpen && menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
      if (e.key === '/' && e.ctrlKey) {
        setIsOpen(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Change animation randomly on menu open for more interactivity
  useEffect(() => {
    if (isOpen) {
      const animations = ['pulse', 'bounce', 'float']
      setAnimation(animations[Math.floor(Math.random() * animations.length)])
    }
  }, [isOpen])

  const handleLogout = async () => {
    try {
      // Use the async thunk for complete logout
      await dispatch(performLogout()).unwrap();

      // Redirect to home page or login page
      router.push('/login');

      // Optional: Force refresh to ensure clean state
      // window.location.reload();

    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, clear the auth state
      dispatch(clearAuthState());
      router.push('/');
    }
  };

  // Dummy data for notifications and messages
  const notifications = [
    { id: 1, content: 'Alex liked your post', time: '2m ago', read: false },
    { id: 2, content: 'New comment on your photo', time: '1h ago', read: false },
    { id: 3, content: 'Emma started following you', time: '3h ago', read: true }
  ]

  const messages = [
    { id: 1, sender: 'Sarah Wilson', content: 'Hey, how are you doing?', time: '5m ago', avatar: 'https://i.pravatar.cc/150?img=29' },
    { id: 2, sender: 'Mike Johnson', content: 'Did you see the latest update?', time: '2h ago', avatar: 'https://i.pravatar.cc/150?img=12' }
  ]

  // Stats data
  const stats = [
    { label: 'Posts', value: userDetails?.posts || 124 },
    { label: 'Followers', value: userDetails?.followers || 1284 },
    { label: 'Following', value: userDetails?.following || 567 }
  ]

  // Animation variants for more interactive elements
  const pulseAnimation = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: { repeat: Infinity, repeatType: "reverse", duration: 1.5 }
    },
    bounce: {
      y: [0, -10, 0],
      transition: { repeat: Infinity, repeatType: "reverse", duration: 1.2 }
    },
    float: {
      y: [0, -5, 0],
      x: [0, 3, 0],
      transition: { repeat: Infinity, repeatType: "reverse", duration: 2 }
    }
  }

  return (
    <div className="relative z-50" ref={menuRef}>
      {/* Trigger Button with Glass Effect */}
      <motion.button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-full px-4 py-2 hover:bg-gray-50 transition-all shadow-transparent"
        whileTap={{ scale: 0.98 }}
      >
        <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-indigo-500 ring-offset-2">
          <img
            src={userDetails?.profilePicture || "https://i.pravatar.cc/150?img=32"}
            alt={userDetails?.fullName || "User"}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-medium text-gray-800 hidden sm:block">
          {userDetails?.fullName?.split(' ')[0] || "User"}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaChevronDown size={12} className="text-gray-600 mt-1" />
        </motion.div>
      </motion.button>

      {/* Modal Menu with Glass Morphism */}
      {isOpen && (
        <ModalPortal giveBg={true} >
          <AnimatePresence>
            <motion.div
              className="fixed left-1/2 transform -translate-x-1/2 w-[95vw] max-w-md bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl z-50 overflow-hidden border border-gray-100 top-10"
              initial={{ opacity: 0, y: 20, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 20, x: "-50%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Header with close button */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <motion.h2
                  className="text-xl font-bold text-gray-900 flex items-center gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {activeTab === 'main' ? (
                    <>
                      <FaUser className="text-indigo-500" />
                      Your Profile
                    </>
                  ) : activeTab === 'notifications' ? (
                    <>
                      <FaBell className="text-indigo-500" />
                      Notifications
                    </>
                  ) : activeTab === 'messages' ? (
                    <>
                      <FaCommentAlt className="text-indigo-500" />
                      Messages
                    </>
                  ) : (
                    <>
                      <IoSettingsSharp className="text-indigo-500" />
                      Account
                    </>
                  )}
                </motion.h2>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                  whileHover={{ rotate: 90, backgroundColor: '#f3f4f6' }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTimes size={18} className="text-gray-500" />
                </motion.button>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'main' && (
                  <motion.div
                    key="main"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="p-6"
                  >
                    {/* User Profile Information with Animation */}
                    <div className="flex flex-col items-center text-center mb-6">
                      <motion.div
                        className="relative mb-3"
                        whileHover={{ scale: 1.05 }}
                        animate={pulseAnimation[animation]}
                      >
                        <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-indigo-100">
                          <img
                            src={userDetails?.profilePicture || "https://i.pravatar.cc/150?img=32"}
                            alt={userDetails?.fullName || "User"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
                      </motion.div>

                      <h3 className="text-xl font-bold text-gray-900">
                        {userDetails?.fullName || "Alex Johnson"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {userDetails?.email || "alex@example.com"}
                      </p>

                      {/* <div className="flex justify-center gap-6 mt-4 w-full">
                      {stats.map((stat, index) => (
                        <motion.div 
                          key={index} 
                          className="flex flex-col items-center p-2 rounded-lg hover:bg-indigo-50 transition-colors"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + (index * 0.1) }}
                          whileHover={{ scale: 1.1 }}
                        >
                          <span className="text-xl font-bold text-gray-900">{stat.value}</span>
                          <span className="text-xs text-gray-500">{stat.label}</span>
                        </motion.div>
                      ))}
                    </div> */}
                    </div>
                    {/*                   
                  <div className="grid grid-cols-3 gap-3 mb-8">
                    <motion.button
                      onClick={() => setActiveTab('notifications')}
                      className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl hover:shadow-md transition-all"
                      whileHover={{ y: -5, boxShadow: "0 12px 20px -5px rgba(99, 102, 241, 0.2)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="relative">
                        <FaBell size={20} className="text-indigo-600" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                      </div>
                      <span className="text-xs mt-1 font-medium text-indigo-700">Notifications</span>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => setActiveTab('messages')}
                      className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl hover:shadow-md transition-all"
                      whileHover={{ y: -5, boxShadow: "0 12px 20px -5px rgba(59, 130, 246, 0.2)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="relative">
                        <FaCommentAlt size={20} className="text-blue-600" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                      </div>
                      <span className="text-xs mt-1 font-medium text-blue-700">Messages</span>
                    </motion.button>
                    
                    <motion.button
                      className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl hover:shadow-md transition-all"
                      whileHover={{ y: -5, boxShadow: "0 12px 20px -5px rgba(251, 191, 36, 0.2)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaBolt size={20} className="text-amber-600" />
                      <span className="text-xs mt-1 font-medium text-amber-700">Stories</span>
                    </motion.button>
                  </div>
                 */}
                    {/* Menu Options with Enhanced Hover Effects */}
                    <div className="space-y-1">
                      <Link
                        href={`/profile/${userDetails?._id}`}
                        className="flex items-center p-3 text-gray-700 hover:bg-indigo-50 rounded-xl transition-colors group"
                        onClick={() => setIsOpen(false)}
                      >
                        <motion.div
                          className="w-9 h-9 flex items-center justify-center bg-indigo-100 rounded-xl mr-3 group-hover:bg-indigo-200 transition-colors"
                          whileHover={{ rotate: 10 }}
                        >
                          <FaUser size={16} className="text-indigo-700" />
                        </motion.div>
                        <span className="font-medium">View Profile</span>
                      </Link>

                      <Link
                        href="/bookmarks"
                        className="flex items-center p-3 text-gray-700 hover:bg-indigo-50 rounded-xl transition-colors group"
                        onClick={() => setIsOpen(false)}
                      >
                        <motion.div
                          className="w-9 h-9 flex items-center justify-center bg-indigo-100 rounded-xl mr-3 group-hover:bg-indigo-200 transition-colors"
                          whileHover={{ rotate: 10 }}
                        >
                          <FaBookmark size={16} className="text-indigo-700" />
                        </motion.div>
                        <span className="font-medium">Saved Posts</span>
                      </Link>

                      <Link
                        href="/settings"
                        className="flex items-center p-3 text-gray-700 hover:bg-indigo-50 rounded-xl transition-colors group"
                        onClick={() => setIsOpen(false)}
                      >
                        <motion.div
                          className="w-9 h-9 flex items-center justify-center bg-indigo-100 rounded-xl mr-3 group-hover:bg-indigo-200 transition-colors"
                          whileHover={{ rotate: 10 }}
                        >
                          <IoSettingsSharp size={16} className="text-indigo-700" />
                        </motion.div>
                        <span className="font-medium">Settings</span>
                      </Link>
                    </div>

                    {/* Logout Button with Improved Visual */}
                    <motion.button
                      onClick={handleLogout}
                      className="flex w-full items-center justify-center gap-2 mt-6 p-4 bg-gradient-to-r from-red-50 to-red-100 text-red-600 font-medium rounded-xl hover:shadow-md transition-all"
                      whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(239, 68, 68, 0.2)" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaSignOutAlt size={18} />
                      <span>Sign Out</span>
                    </motion.button>

                    {/* Keyboard Shortcut */}
                    <div className="mt-4 flex items-center justify-center gap-1 text-xs text-gray-400">
                      <FaKeyboard size={14} />
                      <span>+</span>
                      <span className="px-1.5 py-0.5 bg-gray-100 rounded-md font-mono">/</span>
                      <span>to toggle menu</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </ModalPortal>
      )}
    </div>
  )
}

export default ProfileMenu
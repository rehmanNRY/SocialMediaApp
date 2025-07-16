"use client";
import React, { useState, useRef, useEffect } from 'react';
import { FiBell, FiCheckCircle, FiX, FiChevronRight, FiInbox } from 'react-icons/fi';
import { MdDelete, MdMarkEmailRead, MdNotificationsActive } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getUserNotifications, 
  markAllNotificationsAsRead, 
  markNotificationAsRead,
  deleteNotification 
} from '@/redux/notifications/notificationsSlice';
import { useRouter } from 'next/navigation';
import { timeAgo } from "@/utility/timeAgo";

const Notification = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [expandedNotification, setExpandedNotification] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const notificationRef = useRef(null);
  const dispatch = useDispatch();
  const router = useRouter();
  
  const { notifications, unreadCount } = useSelector(state => state.notifications);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.97 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.4,
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.25 } }
  };

  const notificationItemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.35,
        ease: "easeOut"
      }
    }),
    exit: { 
      opacity: 0, 
      x: 30, 
      transition: { 
        duration: 0.2,
        ease: "easeIn"
      } 
    },
    expanded: {
      backgroundColor: "#F5F7FF",
      scale: 1.01,
      transition: {
        duration: 0.2
      }
    }
  };

  const badgeVariants = {
    pulse: {
      scale: [1, 1.15, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut"
      }
    }
  };

  // Fetch notifications when component mounts or visibility changes
  useEffect(() => {
    if (showNotifications) {
      dispatch(getUserNotifications());
    }
  }, [dispatch, showNotifications]);

  // Detect screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleClickOutside = (e) => {
    if (notificationRef.current && !notificationRef.current.contains(e.target)) {
      setShowNotifications(false);
      setShowConfirmClear(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle reading a single notification
  const handleNotificationClick = (notification) => {
    if (expandedNotification === notification._id) {
      dispatch(markNotificationAsRead(notification._id));
      router.push(notification.navigateLink);
    } else {
      setExpandedNotification(notification._id);
    }
  };

  // Handle marking all notifications as read
  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsAsRead());
    setShowConfirmClear(false);
  };

  // Handle deleting a notification
  const handleDeleteNotification = (e, notificationId) => {
    e.stopPropagation(); // Prevent triggering the parent click
    
    // Add deletion animation
    const element = document.getElementById(`notification-${notificationId}`);
    if (element) {
      element.style.height = `${element.offsetHeight}px`;
      element.style.overflow = 'hidden';
      
      setTimeout(() => {
        element.style.height = '0';
        element.style.padding = '0';
        element.style.margin = '0';
        element.style.opacity = '0';
        
        setTimeout(() => {
          dispatch(deleteNotification(notificationId));
          if (expandedNotification === notificationId) {
            setExpandedNotification(null);
          }
        }, 300);
      }, 10);
    } else {
      dispatch(deleteNotification(notificationId));
      if (expandedNotification === notificationId) {
        setExpandedNotification(null);
      }
    }
  };

  const filteredNotifications = notifications.filter(notif => 
    activeTab === 'all' || (activeTab === 'unread' && !notif.isRead)
  );

  return (
    <div className="relative" ref={notificationRef}>
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300 relative"
        onClick={() => setShowNotifications(!showNotifications)}
        aria-label="Notifications"
      >
        <FiBell className="w-5 h-5 text-gray-700" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div 
              key="badge"
              initial={{ scale: 0 }}
              animate={["visible", "pulse"]}
              variants={badgeVariants}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-1 -right-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold"
              style={{ 
                minWidth: '18px', 
                height: '18px',
                fontSize: '10px',
                padding: unreadCount > 9 ? '0 4px' : '0',
                boxShadow: '0 2px 5px rgba(79, 70, 229, 0.4)'
              }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {showNotifications && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`absolute mt-4 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-40 ${
              isMobile 
                ? 'w-[calc(100vw-2rem)] left-1/2 transform -translate-x-1/2' 
                : 'w-96 right-0'
            }`}
            style={{ 
              boxShadow: '0 10px 40px -5px rgba(0, 0, 0, 0.15), 0 20px 20px -10px rgba(0, 0, 0, 0.05)',
              maxHeight: 'calc(100vh - 100px)',
              maxWidth: isMobile ? 'calc(100vw - 2rem)' : '24rem'
            }}
          >
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50">
              <div className="flex items-center gap-2">
                <MdNotificationsActive className="text-indigo-600 w-5 h-5" />
                <h5 className="font-bold text-gray-800 text-lg flex items-center">
                  Notifications
                  {unreadCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-2 text-xs font-medium bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full"
                    >
                      {unreadCount} new
                    </motion.span>
                  )}
                </h5>
              </div>
              <AnimatePresence mode="wait">
                {!showConfirmClear ? (
                  <motion.button 
                    key="mark-read-button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: 20 }}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1 text-sm text-indigo-600 font-medium hover:text-indigo-800 transition-colors px-3 py-1.5 rounded-full hover:bg-white hover:shadow-sm"
                    onClick={() => setShowConfirmClear(true)}
                    disabled={unreadCount === 0}
                    style={{ opacity: unreadCount === 0 ? 0.5 : 1 }}
                  >
                    <MdMarkEmailRead className="text-indigo-600" />
                    <span>Mark all read</span>
                  </motion.button>
                ) : (
                  <motion.div
                    key="confirm-buttons"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center gap-2"
                  >
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-full hover:bg-indigo-700 transition-colors shadow-sm"
                      onClick={handleMarkAllRead}
                    >
                      Confirm
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-xs text-gray-500 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
                      onClick={() => setShowConfirmClear(false)}
                    >
                      Cancel
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex p-2 bg-gray-50">
              {['all', 'unread'].map((tab) => (
                <motion.button
                  key={tab}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeTab === tab 
                      ? 'bg-white text-indigo-600 shadow-sm border border-gray-100' 
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setActiveTab(tab);
                    setExpandedNotification(null);
                  }}
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 1 }}
                >
                  {tab === 'all' ? 'All' : 'Unread'}
                  {tab === 'unread' && unreadCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="ml-1 px-1.5 py-0.5 bg-indigo-100 text-indigo-600 rounded-full text-xs"
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </motion.button>
              ))}
            </div>

            <div className="max-h-96 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <AnimatePresence>
                {filteredNotifications.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-8 text-center"
                  >
                    <motion.div 
                      initial={{ y: 10 }}
                      animate={{ y: [0, -10, 0] }}
                      transition={{ 
                        repeat: Infinity,
                        repeatType: "mirror",
                        duration: 2,
                        ease: "easeInOut" 
                      }}
                      className="w-16 h-16 mx-auto bg-indigo-50 rounded-full flex items-center justify-center mb-4"
                    >
                      <FiInbox className="w-8 h-8 text-indigo-400" />
                    </motion.div>
                    <p className="text-gray-700 font-medium">No notifications yet</p>
                    <p className="text-gray-500 text-sm mt-2">
                      {activeTab === 'unread' ? 'You have read all notifications' : 'You don\'t have any notifications'}
                    </p>
                  </motion.div>
                )}
                
                {filteredNotifications.map((notification, index) => {
                  const isExpanded = expandedNotification === notification._id;
                  
                  return (
                    <motion.div
                      layout
                      id={`notification-${notification._id}`}
                      key={notification._id}
                      custom={index}
                      variants={notificationItemVariants}
                      initial="hidden"
                      animate={isExpanded ? "expanded" : "visible"}
                      exit="exit"
                      layoutId={`notification-${notification._id}`}
                      className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-all cursor-pointer relative ${isExpanded ? 'shadow-md' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      {!notification.isRead && (
                        <motion.div 
                          layoutId={`unread-indicator-${notification._id}`}
                          initial={{ height: 0 }}
                          animate={{ height: '100%' }}
                          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r"
                        />
                      )}
                      
                      <div className="flex items-start">
                        <div className="shrink-0 mr-3">
                          <motion.div 
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            className={`w-12 h-12 rounded-full ${!notification.isRead ? 'bg-gradient-to-r from-indigo-500 to-purple-500 p-0.5' : 'border-2 border-gray-200'}`}
                          >
                            <div className="h-full w-full bg-white rounded-full overflow-hidden">
                              <img 
                                src={notification.senderUser.profilePicture} 
                                className='h-full w-full object-cover rounded-full' 
                                alt={notification.senderUser.name || "User"} 
                              />
                            </div>
                          </motion.div>
                        </div>
                        
                        <div className="flex-1 pl-1">
                          <div className="flex justify-between items-start">
                            <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-800' : 'font-medium text-gray-700'}`}>
                              <span className="capitalize">{notification.message}</span>
                            </p>
                            <div className="flex items-center gap-1">
                              {isExpanded && (
                                <motion.button
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="text-indigo-600 hover:text-indigo-800 p-1 rounded-full hover:bg-white hover:shadow-sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedNotification(null);
                                  }}
                                >
                                  <FiX size={16} />
                                </motion.button>
                              )}
                              <motion.button 
                                className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-white hover:shadow-sm"
                                onClick={(e) => handleDeleteNotification(e, notification._id)}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <MdDelete size={18} />
                              </motion.button>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-xs text-gray-500">
                              {timeAgo(notification.createdAt)}
                            </p>
                            {!notification.isRead ? (
                              <motion.span 
                                initial={{ opacity: 0.5 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                  repeat: Infinity,
                                  repeatType: "reverse",
                                  duration: 1.5
                                }}
                                className="inline-flex items-center text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full"
                              >
                                <motion.span
                                  animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.5, 1, 0.5]
                                  }}
                                  transition={{
                                    repeat: Infinity,
                                    duration: 2
                                  }}
                                  className="w-1.5 h-1.5 rounded-full bg-indigo-600 mr-1"
                                ></motion.span>
                                New
                              </motion.span>
                            ) : (
                              <span className="text-xs text-gray-400 flex items-center">
                                <FiCheckCircle className="mr-1" size={12} />
                                Read
                              </span>
                            )}
                          </div>
                          
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-3 text-sm text-gray-600 overflow-hidden"
                              >
                                <p>
                                  Additional details about this notification would appear here. Click to navigate to the related content.
                                </p>
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="mt-2 px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg flex items-center gap-1 shadow-sm hover:bg-indigo-700 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(markNotificationAsRead(notification._id));
                                    router.push(notification.navigateLink);
                                  }}
                                >
                                  View details
                                  <FiChevronRight size={14} />
                                </motion.button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            
            {notifications.length > 5 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-3 text-center border-t border-gray-100 bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50"
              >
                <motion.button 
                  className="flex items-center justify-center w-full text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors gap-1 py-2 hover:bg-white rounded-lg"
                  onClick={() => {
                    setShowNotifications(false);
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>View all notifications</span>
                  <FiChevronRight size={16} />
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notification;
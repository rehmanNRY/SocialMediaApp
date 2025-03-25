"use client";
import React, { useState, useRef, useEffect } from 'react';
import { FiBell } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Notification = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const notificationRef = useRef(null);

  // Sample notifications for demonstration
  const notifications = [
    { id: 1, type: 'like', user: 'Sarah Chen', content: 'liked your post', time: '2m ago', read: false },
    { id: 2, type: 'comment', user: 'Mike Johnson', content: 'commented on your photo', time: '1h ago', read: false },
    { id: 3, type: 'friend', user: 'Emma Wilson', content: 'accepted your connection request', time: '3h ago', read: true },
    { id: 4, type: 'mention', user: 'David Lee', content: 'mentioned you in a comment', time: '5h ago', read: true },
  ];

  const handleClickOutside = (e) => {
    if (notificationRef.current && !notificationRef.current.contains(e.target)) {
      setShowNotifications(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={notificationRef}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <FiBell className="w-5 h-5 text-gray-700" />
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 15
          }}
        ></motion.span>
      </motion.button>

      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-40"
          >
            <div className="p-3 border-b border-gray-100 flex justify-between items-center">
              <h5 className="font-semibold text-gray-800">Notifications</h5>
              <div className="flex space-x-1">
                <button className="text-xs text-indigo-600 font-medium hover:underline">Mark all read</button>
              </div>
            </div>

            <div className="flex border-b border-gray-100">
              <button
                className={`flex-1 py-2 text-xs font-medium ${activeTab === 'all' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-800'}`}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
              <button
                className={`flex-1 py-2 text-xs font-medium ${activeTab === 'unread' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-800'}`}
                onClick={() => setActiveTab('unread')}
              >
                Unread
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto">
              {notifications
                .filter(notif => activeTab === 'all' || (activeTab === 'unread' && !notif.read))
                .map(notification => (
                  <motion.div
                    key={notification.id}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-indigo-50/30' : ''}`}
                  >
                    <div className="flex items-start">
                      <div className="shrink-0 mr-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {notification.user.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium text-gray-900">{notification.user}</span>
                          {' '}
                          <span className="text-gray-600">{notification.content}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
            <div className="p-3 text-center border-t border-gray-100">
              <button className="text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors">
                View all notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notification;
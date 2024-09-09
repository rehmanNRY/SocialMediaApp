"use client"
import React from 'react';
import { FaUserCog, FaLock, FaBell, FaEye, FaShieldAlt, FaLanguage, FaKey, FaUserSlash, FaUserShield } from 'react-icons/fa';
import { FiEdit, FiChevronRight, FiEye } from 'react-icons/fi';
import { motion } from 'framer-motion';

const SettingsPage = () => {
  return (
    <div className="settings-page min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="settings-categories grid grid-cols-1 gap-6 p-8">

          {/* Account Settings */}
          <motion.div
            className="setting-item bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition duration-200"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <FaUserCog className="text-blue-600" /> Account Settings
            </h2>
            <ul className="space-y-3">
              {[
                { title: 'Edit Profile', action: 'Edit', icon: <FiEdit /> },
                { title: 'Change Password', action: 'Change', icon: <FaKey /> },
                { title: 'Two-Factor Authentication', action: 'Manage', icon: <FaUserShield /> },
                { title: 'Deactivate Account', action: 'Deactivate', danger: true, icon: <FaUserSlash /> },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex justify-between items-center p-3 bg-white rounded-lg hover:bg-gray-100 transition duration-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="flex items-center gap-3">
                    {item.icon}
                     {item.title}
                  </span>
                  <button
                    className={`text-sm font-semibold ${item.danger ? 'text-red-600' : 'text-blue-600'
                      } hover:underline`}
                  >
                    {item.action}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Privacy Settings */}
          <motion.div
            className="setting-item bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition duration-200"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <FaLock className="text-blue-600" /> Privacy Settings
            </h2>
            <ul className="space-y-3">
              {[
                { title: 'Profile Visibility', action: 'Edit', icon: <FaEye /> },
                { title: 'Blocked Users', action: 'Manage', icon: <FaUserSlash /> },
                { title: 'Activity Status', action: 'Edit', icon: <FiEdit /> },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex justify-between items-center p-3 bg-white rounded-lg hover:bg-gray-100 transition duration-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="flex items-center gap-3">
                    {item.icon}
                     {item.title}
                  </span>
                  <button className="text-blue-600 font-semibold text-sm hover:underline">{item.action}</button>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Notification Settings */}
          <motion.div
            className="setting-item bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition duration-200"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <FaBell className="text-blue-600" /> Notification Settings
            </h2>
            <ul className="space-y-3">
              {[
                { title: 'Push Notifications', action: 'Edit', icon: <FaBell /> },
                { title: 'Email Notifications', action: 'Edit', icon: <FaBell /> },
                { title: 'SMS Notifications', action: 'Edit', icon: <FaBell /> },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex justify-between items-center p-3 bg-white rounded-lg hover:bg-gray-100 transition duration-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="flex items-center gap-3">
                    {item.icon}
                     {item.title}
                  </span>
                  <button className="text-blue-600 font-semibold text-sm hover:underline">{item.action}</button>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Appearance Settings */}
          <motion.div
            className="setting-item bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition duration-200"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <FaEye className="text-blue-600" /> Appearance
            </h2>
            <ul className="space-y-3">
              {[
                { title: 'Theme', action: 'Change', icon: <FaEye /> },
                { title: 'Font Size', action: 'Edit', icon: <FiEdit /> },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex justify-between items-center p-3 bg-white rounded-lg hover:bg-gray-100 transition duration-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="flex items-center gap-3">
                    {item.icon}
                     {item.title}
                  </span>
                  <button className="text-blue-600 font-semibold text-sm hover:underline">{item.action}</button>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Security Settings */}
          <motion.div
            className="setting-item bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition duration-200"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <FaShieldAlt className="text-blue-600" /> Security Settings
            </h2>
            <ul className="space-y-3">
              {[
                { title: 'Login Alerts', action: 'Manage', icon: <FaShieldAlt /> },
                { title: 'Recent Login Activity', action: 'View', icon: <FiEye /> },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex justify-between items-center p-3 bg-white rounded-lg hover:bg-gray-100 transition duration-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="flex items-center gap-3">
                    {item.icon}
                     {item.title}
                  </span>
                  <button className="text-blue-600 font-semibold text-sm hover:underline">{item.action}</button>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Language & Region */}
          <motion.div
            className="setting-item bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition duration-200"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <FaLanguage className="text-blue-600" /> Language & Region
            </h2>
            <ul className="space-y-3">
              {[
                { title: 'Language', action: 'Edit', icon: <FaLanguage /> },
                { title: 'Time Zone', action: 'Edit', icon: <FaLanguage /> },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex justify-between items-center p-3 bg-white rounded-lg hover:bg-gray-100 transition duration-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="flex items-center gap-3">
                    {item.icon}
                     {item.title}
                  </span>

                  <button className="text-blue-600 font-semibold text-sm hover:underline">{item.action}</button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

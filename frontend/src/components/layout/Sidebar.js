"use client"
import React, { useEffect, useState } from 'react';
import { logout } from '@/redux/auth/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiHome, FiUser, FiList, FiAlertCircle, FiUserPlus, FiBookmark, FiSettings, FiLogOut } from 'react-icons/fi';
import { AiOutlineFileText } from 'react-icons/ai';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDetails, setLoggedIn } from '@/redux/auth/authSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();
  const { isLoggedIn, userDetails, loading, error } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };


  useEffect(() => {
    setIsClient(true);
    if (isLoggedIn) {
      dispatch(fetchUserDetails());
    }
  }, [isLoggedIn, dispatch]);
  if (!isClient) {
    return null; // Render nothing until client-side rendering is confirmed
  }

  return (
    <>
      {isLoggedIn && <div className={`w-64`}>
        <div className="sidebar bg-gradient-to-b from-white via-gray-50 to-blue-50 text-gray-900 flex flex-col border-r border-gray-200 shadow-xl fixed w-64 overflow-y-auto" style={{ height: "calc(100vh - 4rem)" }}>
          {/* Profile Section */}
          <div className="flex items-center p-6 space-x-4 bg-white shadow-md">
            <motion.img
              src={userDetails?.profilePicture}
              alt="Profile"
              className="w-12 h-12 rounded-full bg-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            />
            {loading && <p>Loading user details...</p>}
            {error && <p>Error: {error.message || JSON.stringify(error)}</p>}

            <div>
              <h3 className="font-semibold text-lg">{userDetails?.fullName}</h3>
              <p className="text-sm text-gray-600">@{userDetails?.username}</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 py-4">
            <ul className="space-y-2.5 overflow-hidden">
              {menuItems.map((item) => (
                <motion.li
                  key={item.label}
                  className="relative group"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    href={item.myProfile ? `/profile/${userDetails?._id}` : item.href}
                    className="flex items-center px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gradient-to-r from-blue-50 to-blue-200 hover:text-blue-700"
                  >
                    {item.icon}
                    <span className="ml-4">{item.label}</span>
                    {item.isNew && (
                      <span className="ml-2 bg-green-200 text-green-800 text-xs font-semibold px-2 py-1 rounded-full animate-pulse">
                        NEW
                      </span>
                    )}
                  </Link>
                  <div className="absolute right-0 top-0 h-full w-1 bg-blue-500 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Settings and Support */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <ul className="space-y-3">
              <li>
                <Link
                  href="/contact"
                  className="flex items-center p-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  <FiUser className="mr-3 w-6 h-6 text-purple-500" />
                  Contact
                </Link>
              </li>
              <li>
                <button
                  className="flex items-center p-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-red-100 hover:text-red-500 w-full text-left"
                  onClick={handleLogout}
                >
                  <FiLogOut className="mr-3 w-6 h-6 text-red-500" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>}
    </>
  );
};

// Menu items data
const menuItems = [
  {
    label: 'Home',
    href: '/',
    icon: <FiHome className="w-6 h-6 text-blue-500" />,
  },
  {
    label: 'User Profile',
    // href: {userprofile?._id},
    myProfile: true,
    icon: <FiUser className="w-6 h-6 text-green-500" />,
  },
  {
    label: 'Friend List',
    href: '/friends',
    icon: <FiList className="w-6 h-6 text-orange-500" />,
  },
  {
    label: 'Pending Requests',
    href: '/pending-requests',
    icon: <FiAlertCircle className="w-6 h-6 text-yellow-500" />,
  },
  {
    label: 'Sent Requests',
    href: '/sent-requests',
    icon: <AiOutlineFileText className="w-6 h-6 text-teal-500" />,
  },
  {
    label: 'Suggestions',
    href: '/people',
    icon: <FiUserPlus className="w-6 h-6 text-pink-500" />,
  },
  {
    label: 'Bookmarks',
    href: '/bookmarks',
    icon: <FiBookmark className="w-6 h-6 text-purple-500" />,
    isNew: true,
  },
  {
    label: 'My Posts',
    href: '/my-posts',
    icon: <AiOutlineFileText className="w-6 h-6 text-cyan-500" />,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <FiSettings className="w-6 h-6 text-indigo-500" />,
  },
];

export default Sidebar;
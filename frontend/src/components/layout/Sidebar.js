"use client"
import React, { useEffect, useState } from 'react';
import { logout } from '@/redux/auth/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDetails } from '@/redux/auth/authSlice';

const Sidebar = ({ isSidebar }) => {
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);
  const [activeIcon, setActiveIcon] = useState(null);
  const [minimize, setMinimize] = useState(false)
  const changeActive = (activeIndex) => {
    setActiveIcon(activeIndex);
  }

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
  const toggleSidebar = () => {
    setMinimize(!minimize);
  }
  return (
    <>
      {isLoggedIn && <div className={`${minimize ? 'w-[5.5rem]' : `md:w-64 w-screen ${isSidebar ? 'block' : 'hidden md:block md:relative fixed z-50'}`}`}>
        <div className={`sidebar from-white via-gray-50 to-blue-50 text-gray-900 flex flex-col border-r border-gray-200 shadow-xl fixed overflow-y-auto ${minimize ? 'w-[5.5rem]' : 'w-screen md:w-64 bg-gradient-to-b'}`} style={{ height: "calc(100vh - 4.5rem)" }}>
          <button
            className="absolute right-0 bottom-32 bg-white text-black border border-gray-200 shadow-md p-2 rounded-l-lg z-10 md:"
            onClick={toggleSidebar}
          >
            {minimize ? '>>' : '<<'}
          </button>
          {/* Profile Section */}
          <Link href={`/profile/${userDetails?._id}`} className={`flex items-center space-x-4 shadow-sm border-b border-gray-200 bg-gray-50  ${minimize ? 'justify-center py-6' : 'p-6'}`}>
            <motion.img
              src={userDetails?.profilePicture}
              alt="Profile"
              className={`object-cover rounded-full bg-gray-300 ${minimize ? 'w-10 h-10' : 'w-12 h-12'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            />
            {loading && <p>Loading user details...</p>}
            {error && <p>Error: {error.message || JSON.stringify(error)}</p>}

            <div className={`${minimize ? 'hidden' : ''}`}>
              <h3 className="text-lg HelvM">{userDetails?.fullName}</h3>
              <p className="text-sm text-gray-700 HelvR">@{userDetails?.username}</p>
            </div>
          </Link>

          {/* Navigation Menu */}
          <nav className="flex-1 py-2">
            <ul className="space-y-1 overflow-hidden px-2">
              {menuItems.map((item, index) => (
                <motion.li
                  key={item.label}
                  className="relative group"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    href={item.myProfile ? `/profile/${userDetails?._id}` : item.href}
                    className={`flex items-center rounded-xl transition-all duration-200 
                      ${activeIcon === index
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                        : 'hover:bg-blue-50 text-gray-700 hover:text-blue-700'} 
                      ${minimize ? 'justify-center p-3' : 'px-4 py-2.5'}`}
                    onClick={() => changeActive(index)}
                  >
                    <img src={item.iconSrc} className={`select-none ${minimize ? 'w-9' : 'w-8'}`} alt={`${item.label}`} />
                    <span className={`ml-4 ${minimize ? 'hidden' : ''}`}>{item.label}</span>
                    {item.isNew && (
                      <span className={`ml-2 bg-green-200 text-green-800 text-xs font-semibold px-2 py-1 rounded-full animate-pulse ${minimize ? 'hidden' : ''}`}>
                        NEW
                      </span>
                    )}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Settings and Support */}
          <div className="py-4 border-t border-gray-200 bg-gray-50">
            <ul className="space-y-1 px-4 pb-2">
              <li>
                <Link
                  href="/contact"
                  className={`flex items-center text-sm font-medium rounded-lg transition-all duration-200 ${activeIcon === 'contact' ? 'bg-blue-50 text-blue-700' : ''}  ${minimize ? 'py-3 justify-center' : 'p-3 hover:bg-blue-50 hover:text-blue-700'}`}
                  onClick={() => changeActive('contact')}
                >
                  <img src="https://res.cloudinary.com/datvbo0ey/image/upload/v1726327946/Microsoft-Fluentui-Emoji-3d-E-Mail-3d.1024_qzqrs2.png" className="w-8" alt="contact" />
                  <span className={`ml-4 ${minimize ? 'hidden' : ''}`}>Contact</span>
                </Link>
              </li>
              <li>
                <button
                  className={`flex items-center text-sm font-medium rounded-lg transition-all duration-200 w-full text-left ${minimize ? 'py-3 justify-center' : 'p-3 hover:bg-red-100 hover:text-red-500'}`}
                  onClick={handleLogout}
                >
                  <img src="https://cdn-icons-png.flaticon.com/512/1828/1828304.png" className="w-8 h-8" alt="logout" />
                  <span className={`ml-4 ${minimize ? 'hidden' : ''}`}>Logout</span>
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
    iconSrc: 'https://res.cloudinary.com/datvbo0ey/image/upload/v1726327946/home-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--house-property-building-estate-architecture-user-interface-pack-illustrations-3307683_w702ca.png',
  },
  {
    label: 'User Profile',
    myProfile: true,
    iconSrc: 'https://cdn-icons-png.flaticon.com/512/15786/15786272.png',
  },
  {
    label: 'Friend List',
    href: '/friends',
    iconSrc: 'https://cdn-icons-png.flaticon.com/512/15430/15430330.png',
  },
  {
    label: 'Pending Requests',
    href: '/pending-requests',
    iconSrc: 'https://cdn-icons-png.flaticon.com/512/5509/5509916.png',
  },
  {
    label: 'Sent Requests',
    href: '/sent-requests',
    iconSrc: 'https://cdn-icons-png.flaticon.com/512/5509/5509730.png',
  },
  {
    label: 'Suggestions',
    href: '/people',
    iconSrc: 'https://cdn-icons-png.flaticon.com/256/5509/5509446.png',
  },
  {
    label: 'Bookmarks',
    href: '/bookmarks',
    iconSrc: 'https://cdn-icons-png.freepik.com/512/5300/5300640.png',
    isNew: true,
  },
  {
    label: 'Stories',
    href: '/stories',
    iconSrc: 'https://res.cloudinary.com/datvbo0ey/image/upload/v1726328461/social-media-post-3d-icon-download-in-png-blend-fbx-gltf-file-formats--like-logo-user-network-miscellaneous-pack-icons-5753373_imunlr.png',
  },
  {
    label: 'Settings',
    href: '/settings',
    iconSrc: 'https://cdn-icons-png.flaticon.com/512/2698/2698011.png',
  },
];

export default Sidebar;
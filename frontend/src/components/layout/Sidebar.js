"use client"
import React, { useEffect, useState } from 'react';
import { performLogout, clearAuthState } from '@/redux/auth/authSlice';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDetails } from '@/redux/auth/authSlice';
import { FiMail } from 'react-icons/fi';

const Sidebar = ({ isSidebar, onClose }) => {
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);
  const [minimize, setMinimize] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const { isLoggedIn, userDetails, loading, error } = useSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      // Use the async thunk for complete logout
      await dispatch(performLogout()).unwrap();
      
      // Close sidebar on mobile after logout
      if (onClose) onClose();
      
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

  // Handle link clicks to close sidebar on mobile
  const handleLinkClick = () => {
    if (onClose) onClose();
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

  // Enhanced animation variants
  const sidebarVariants = {
    expanded: {
      width: "16rem",
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    collapsed: {
      width: "5.5rem",
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  const itemVariants = {
    initial: { scale: 1, y: 0 },
    hover: {
      scale: 1.02,
      y: -1,
      transition: { 
        duration: 0.2, 
        ease: "easeOut",
        type: "tween"
      }
    }
  };

  const iconVariants = {
    initial: { rotate: 0, scale: 1 },
    hover: { 
      rotate: 5, 
      scale: 1.1,
      transition: { 
        duration: 0.2, 
        ease: "easeOut",
        type: "tween"
      }
    }
  };

  const shimmerVariants = {
    initial: { x: "-100%" },
    hover: { 
      x: "100%",
      transition: { 
        duration: 0.6, 
        ease: "easeInOut" 
      }
    }
  };

  return (
    <>
      {isLoggedIn &&
        <motion.div
          className={`${isSidebar ? 'block' : 'hidden md:block md:relative fixed z-20 md:w-auto m-screen'}`}
          initial={false}
          animate={minimize ? "collapsed" : "expanded"}
          variants={sidebarVariants}
        >
          {/* Mobile overlay */}
          {isSidebar && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
              onClick={onClose}
            />
          )}
          
          <motion.div
            className={`sidebar fixed overflow-y-auto bg-white text-gray-900 flex flex-col border-r border-gray-200 shadow-lg
              ${isSidebar ? 'w-screen md:w-auto' : ''}
              ${isSidebar ? 'top-0 left-0 md:top-auto md:left-auto' : ''}
            `}
            style={{ 
              height: isSidebar ? "100vh" : "calc(100vh - 4rem)",
              zIndex: isSidebar ? 30 : 20
            }}
            animate={minimize ? "collapsed" : "expanded"}
            variants={sidebarVariants}
          >
            {/* Mobile Close Button */}
            {isSidebar && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute top-4 right-4 z-20 md:hidden bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full shadow-sm"
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            )}

            {/* Enhanced Toggle Button - Hidden on mobile */}
            <motion.button
              className="absolute right-0 bottom-32 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-2.5 rounded-l-lg z-10 shadow-lg overflow-hidden hidden md:block"
              onClick={toggleSidebar}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 8px 25px -8px rgba(59, 130, 246, 0.6)",
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-white opacity-0"
                whileHover={{ 
                  opacity: [0, 0.1, 0],
                  transition: { duration: 0.6, repeat: Infinity }
                }}
              />
              {minimize ? (
                <motion.svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  <polyline points="13 17 18 12 13 7"></polyline>
                  <polyline points="6 17 11 12 6 7"></polyline>
                </motion.svg>
              ) : (
                <motion.svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  whileHover={{ x: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <polyline points="11 17 6 12 11 7"></polyline>
                  <polyline points="18 17 13 12 18 7"></polyline>
                </motion.svg>
              )}
            </motion.button>

            {/* Enhanced Profile Section */}
            <div>
              <Link href={`/profile/${userDetails?._id}`} className="relative overflow-hidden group" onClick={handleLinkClick}>
                <motion.div
                  className={`flex items-center space-x-2.5 border-b border-gray-200 bg-white relative ${minimize ? 'justify-center py-6' : 'px-5 py-4'}`}
                  whileHover={{ backgroundColor: "#fafbff" }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Subtle hover gradient */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  <motion.div
                    className={`rounded-full overflow-hidden border-2 border-white shadow-md relative z-10 ${minimize ? 'w-10 h-10' : 'w-14 h-14'}`}
                    whileHover={{ 
                      scale: 1.05, 
                      rotate: 2,
                      borderColor: "#6366f1"
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ minWidth: minimize ? '40px' : '56px', minHeight: minimize ? '40px' : '56px' }}
                  >
                    <motion.img
                      src={userDetails?.profilePicture || "https://via.placeholder.com/80"}
                      alt="Profile"
                      className="object-cover w-full h-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      whileHover={{ scale: 1.1 }}
                    />
                  </motion.div>

                  <AnimatePresence>
                    {!minimize && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col overflow-hidden relative z-10"
                      >
                        <motion.h3 
                          className="text-lg font-semibold text-gray-800 capitalize whitespace-nowrap overflow-hidden text-ellipsis"
                          whileHover={{ color: "#4f46e5" }}
                          transition={{ duration: 0.2 }}
                        >
                          {userDetails?.fullName || "Guest User"}
                        </motion.h3>
                        <p className="text-sm text-indigo-600 font-medium whitespace-nowrap overflow-hidden text-ellipsis">@{userDetails?.username || "guest"}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            </div>

            {/* Enhanced Navigation Menu */}
            <nav className="flex-1 py-4 px-3">
              <ul className="space-y-2 overflow-hidden">
                {menuItems.map((item, index) => {
                  const isActive = pathname === item.href || (item.myProfile && pathname.includes('/profile'));
                  return (
                    <motion.li
                      key={item.label}
                      className="relative"
                      onHoverStart={() => setHoveredItem(item.label)}
                      onHoverEnd={() => setHoveredItem(null)}
                      variants={itemVariants}
                      initial="initial"
                      whileHover="hover"
                    >
                      <Link
                        href={item.myProfile ? `/profile/${userDetails?._id}` : item.href}
                        onClick={handleLinkClick}
                        className={`flex items-center rounded-xl transition-all duration-300 relative overflow-hidden group
                          ${isActive
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'text-gray-700 hover:text-indigo-700 hover:bg-[#EEF2FF] hover:shadow-sm'} 
                          ${minimize ? 'justify-center p-3' : 'px-4 py-3'}`}
                      >
                        {/* Shimmer effect for non-active items */}
                        {!isActive && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
                            variants={shimmerVariants}
                            initial="initial"
                            whileHover="hover"
                          />
                        )}

                        {/* Subtle glow for active items */}
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-blue-500 opacity-20"
                            animate={{ 
                              opacity: [0.2, 0.3, 0.2],
                              scale: [1, 1.02, 1]
                            }}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        )}

                        <motion.div 
                          className={`relative z-10 ${isActive ? '' : 'group'}`}
                          variants={iconVariants}
                          initial="initial"
                          whileHover="hover"
                        >
                          <motion.img
                            src={item.iconSrc}
                            className={`select-none ${minimize ? 'w-8 h-8' : 'w-7 h-7'}`}
                            alt={`${item.label}`}
                            style={{ filter: isActive ? 'brightness(1.2)' : 'none' }}
                          />

                          {/* Ripple effect for icons */}
                          {!isActive && hoveredItem === item.label && (
                            <motion.div
                              className="absolute inset-0 bg-indigo-200 rounded-full opacity-30"
                              initial={{ scale: 0, opacity: 0.5 }}
                              animate={{ 
                                scale: [0, 1.5, 0],
                                opacity: [0.5, 0.2, 0]
                              }}
                              transition={{ duration: 0.6 }}
                            />
                          )}
                        </motion.div>

                        <AnimatePresence>
                          {!minimize && (
                            <motion.span
                              className={`ml-4 font-medium text-sm relative z-10 ${isActive ? 'text-white' : ''}`}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              transition={{ duration: 0.2 }}
                              whileHover={{ x: 2 }}
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </AnimatePresence>

                        {item.isNew && !minimize && (
                          <motion.span
                            className="ml-2 bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded-full relative z-10"
                            animate={{
                              scale: [1, 1.1, 1],
                              boxShadow: [
                                "0 0 0 0 rgba(34, 197, 94, 0)",
                                "0 0 0 4px rgba(34, 197, 94, 0.2)",
                                "0 0 0 0 rgba(34, 197, 94, 0)"
                              ]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            NEW
                          </motion.span>
                        )}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            {/* Enhanced Settings and Support */}
            <div className="py-3 border-t border-gray-200">
              <AnimatePresence>
                {!minimize && (
                  <motion.h3
                    className="text-xs uppercase text-gray-500 font-semibold ml-6 mb-2 mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ 
                      color: "#6366f1",
                      x: 2
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    Support
                  </motion.h3>
                )}
              </AnimatePresence>

              <ul className="space-y-1 px-3">
                <motion.li
                  variants={itemVariants}
                  initial="initial"
                  whileHover="hover"
                >
                  <Link
                    href="/contact"
                    onClick={handleLinkClick}
                    className={`flex items-center text-sm font-medium rounded-xl transition-all duration-300 relative overflow-hidden group
                      ${pathname === '/contact' ? 'bg-blue-50 text-blue-700' : ''}  
                      ${minimize ? 'py-3 justify-center' : 'p-3 hover:bg-blue-50 hover:text-blue-700'}`}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100 to-transparent opacity-0 group-hover:opacity-30"
                      variants={shimmerVariants}
                      initial="initial"
                      whileHover="hover"
                    />
                    
                    <motion.img
                      src="https://res.cloudinary.com/datvbo0ey/image/upload/v1726327946/Microsoft-Fluentui-Emoji-3d-E-Mail-3d.1024_qzqrs2.png"
                      className="w-7 relative z-10"
                      alt="contact"
                      variants={iconVariants}
                      initial="initial"
                      whileHover="hover"
                    />

                    <AnimatePresence>
                      {!minimize && (
                        <motion.span
                          className="ml-4 relative z-10"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          whileHover={{ x: 2 }}
                        >
                          Contact
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </motion.li>

                <motion.li
                  variants={itemVariants}
                  initial="initial"
                  whileHover="hover"
                >
                  <motion.button
                    className={`flex items-center text-sm font-medium rounded-xl transition-all duration-300 w-full text-left relative overflow-hidden group
                      ${minimize ? 'py-3 justify-center' : 'p-3 hover:bg-red-50 hover:text-red-600'}`}
                    onClick={handleLogout}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-red-100 to-transparent opacity-0 group-hover:opacity-30"
                      variants={shimmerVariants}
                      initial="initial"
                      whileHover="hover"
                    />

                    <motion.img
                      src="https://cdn-icons-png.flaticon.com/512/1828/1828304.png"
                      className="w-7 h-7 relative z-10"
                      alt="logout"
                      variants={iconVariants}
                      initial="initial"
                      whileHover="hover"
                    />

                    <AnimatePresence>
                      {!minimize && (
                        <motion.span
                          className="ml-4 relative z-10"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          whileHover={{ x: 2 }}
                        >
                          Logout
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.li>
              </ul>

              {/* Enhanced Help Card */}
              {!minimize && (
                <motion.div
                  className="mb-6 mx-3 mt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ 
                    y: -2,
                    boxShadow: "0 8px 25px -8px rgba(79, 70, 229, 0.3)"
                  }}
                >
                  <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-5 rounded-2xl shadow-sm border border-indigo-100 group cursor-pointer">
                    {/* Animated background elements */}
                    <motion.div 
                      className="absolute -right-6 -top-6 w-20 h-20 bg-indigo-100 rounded-full opacity-50"
                      whileHover={{ 
                        scale: 1.1,
                        opacity: 0.7
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div 
                      className="absolute right-8 top-4 w-6 h-6 bg-blue-100 rounded-full opacity-70"
                      whileHover={{ 
                        scale: 1.2,
                        x: -2,
                        y: 2
                      }}
                      transition={{ duration: 0.3 }}
                    />

                    <motion.h4 
                      className="text-sm font-bold text-indigo-800"
                      whileHover={{ color: "#4338ca" }}
                      transition={{ duration: 0.2 }}
                    >
                      Need Help?
                    </motion.h4>
                    <motion.p 
                      className="text-xs text-indigo-600 mt-1 mb-3"
                      whileHover={{ color: "#5b21b6" }}
                      transition={{ duration: 0.2 }}
                    >
                      Our support team is ready to assist you
                    </motion.p>
                    <Link
                      className="w-full text-xs font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-500 px-3 py-2 rounded-lg shadow-sm flex items-center justify-center relative overflow-hidden group/button"
                      href={"/contact"}
                      onClick={handleLinkClick}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover/button:opacity-100"
                        transition={{ duration: 0.3 }}
                      />
                      <motion.div
                        className="flex items-center relative z-10"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FiMail className="mr-1.5" />
                        Contact Support
                      </motion.div>
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      }
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
    label: 'Stories',
    href: '/stories',
    iconSrc: 'https://res.cloudinary.com/datvbo0ey/image/upload/v1726328461/social-media-post-3d-icon-download-in-png-blend-fbx-gltf-file-formats--like-logo-user-network-miscellaneous-pack-icons-5753373_imunlr.png',
    isNew: true,
  },
  {
    label: 'Settings',
    href: '/settings',
    iconSrc: 'https://cdn-icons-png.flaticon.com/512/2698/2698011.png',
  },
];

export default Sidebar;
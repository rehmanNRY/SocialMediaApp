"use client";
import { useState, useEffect } from "react";
import { AiOutlineNumber } from "react-icons/ai";
import { BsGear, BsHash, BsBookmark } from "react-icons/bs";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '@/redux/users/usersSlice';
import { AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiHome, FiTrendingUp, FiActivity, FiCompass } from "react-icons/fi";
import { RiHomeLine, RiCompassDiscoverLine, RiFireLine, RiBookmarkLine, RiSettings4Line } from "react-icons/ri";

const Rightbar = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [isClient, setIsClient] = useState(false);
  const [showMoreUsers, setShowMoreUsers] = useState(false);
  const [showMoreTags, setShowMoreTags] = useState(false);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const users = useSelector((state) => state.users.users);
  const reversedUsers = users.slice().reverse();

  // Dummy trending hashtags data
  const trendingHashtags = [
    { tag: "photography", count: "24.5K", color: "#FF5757" },
    { tag: "travel", count: "18.3K", color: "#3498db" },
    { tag: "fitness", count: "15.7K", color: "#2ecc71" },
    { tag: "cooking", count: "12.9K", color: "#f39c12" },
    { tag: "technology", count: "11.2K", color: "#9b59b6" },
    { tag: "music", count: "10.8K", color: "#1abc9c" },
    { tag: "art", count: "9.7K", color: "#e74c3c" },
    { tag: "books", count: "8.5K", color: "#34495e" },
  ];

  // Dummy upcoming events
  const upcomingEvents = [
    { name: "Community Meetup", date: "Mar 15", attendees: 45 },
    { name: "Photography Workshop", date: "Mar 20", attendees: 32 },
  ];

  useEffect(() => {
    setIsClient(true);
    dispatch(fetchUsers());
  }, [isLoggedIn, dispatch]);

  // Hide the Rightbar for specific routes
  const hideOnPaths = ["/settings", "/contact", "/profile"];
  const shouldHideRightbar = hideOnPaths.some((path) => pathname.startsWith(path));

  if (!isClient || shouldHideRightbar) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      {isLoggedIn && (
        <div className="md:flex hidden">
          {/* Main Full Rightbar */}
          <div className="w-64 md:block z-20 mr-1 ml-auto">
            <div
              className="rightBar w-64 p-4 bg-white shadow-md flex flex-col gap-4 fixed overflow-y-auto rounded-xl border border-gray-100"
              style={{ height: "calc(100vh - 4rem)" }}
            >
              {/* Story Banner */}
              <div>
                <motion.div
                  className="p-3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl text-white relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full"></div>
                  <div className="absolute -right-1 -bottom-4 w-16 h-16 bg-white/10 rounded-full"></div>

                  <h4 className="font-bold text-sm mb-1">Share Your Story!</h4>
                  <p className="text-xs text-white/80 mb-2">Post a story and let your friends know what you're up to today.</p>
                  <Link href={"/stories"}>
                    <motion.button
                      className="w-full py-1.5 bg-white text-blue-600 rounded-lg text-xs font-semibold hover:bg-opacity-90 transition"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Create Story
                    </motion.button>
                  </Link>

                </motion.div>
              </div>

              {/* Navigation Menu */}
              <motion.div
                className="bg-gray-50 rounded-xl p-3"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <h4 className="text-md font-semibold text-gray-800 mb-3 px-2">Menu</h4>
                <motion.div className="flex flex-col gap-1" variants={containerVariants}>
                  <motion.div variants={itemVariants}>
                    <Link href="/my-posts" className="flex items-center gap-3 hover:bg-white p-2 rounded-lg cursor-pointer transition-all duration-300 group">
                      <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                        <FiHome />
                      </div>
                      <span className="text-gray-700 group-hover:text-gray-900 font-medium">My Posts</span>
                    </Link>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Link href="/explore" className="flex items-center gap-3 hover:bg-white p-2 rounded-lg cursor-pointer transition-all duration-300 group">
                      <div className="bg-blue-100 p-2 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                        <FiCompass />
                      </div>
                      <span className="text-gray-700 group-hover:text-gray-900 font-medium">Explore</span>
                    </Link>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Link href="/hashtags" className="flex items-center gap-3 hover:bg-white p-2 rounded-lg cursor-pointer transition-all duration-300 group">
                      <div className="bg-green-100 p-2 rounded-lg text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                        <FiTrendingUp />
                      </div>
                      <span className="text-gray-700 group-hover:text-gray-900 font-medium">Trending</span>
                    </Link>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Link href="/bookmarks" className="flex items-center gap-3 hover:bg-white p-2 rounded-lg cursor-pointer transition-all duration-300 group">
                      <div className="bg-amber-100 p-2 rounded-lg text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                        <BsBookmark />
                      </div>
                      <span className="text-gray-700 group-hover:text-gray-900 font-medium">Saved</span>
                    </Link>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Link href="/settings" className="flex items-center gap-3 hover:bg-white p-2 rounded-lg cursor-pointer transition-all duration-300 group">
                      <div className="bg-gray-100 p-2 rounded-lg text-gray-600 group-hover:bg-gray-600 group-hover:text-white transition-all duration-300">
                        <BsGear />
                      </div>
                      <span className="text-gray-700 group-hover:text-gray-900 font-medium">Settings</span>
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Trending Hashtags */}
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-semibold text-gray-800 px-2">Trending Tags</h4>
                  <FiActivity className="text-pink-500" />
                </div>
                <motion.div
                  className="flex flex-col gap-2"
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                >
                  {trendingHashtags.slice(0, showMoreTags ? 8 : 4).map((hashtag, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between bg-white p-2 rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer"
                      variants={itemVariants}
                      whileHover={{ x: 3 }}
                      onClick={() => router.push(`/hashtags?hashtag=${hashtag.tag}`)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md" style={{ backgroundColor: `${hashtag.color}20` }}>
                          <BsHash style={{ color: hashtag.color }} />
                        </div>
                        <span className="text-gray-700 text-sm font-medium">{hashtag.tag}</span>
                      </div>
                      <span className="text-xs text-gray-500 font-medium">{hashtag.count}</span>
                    </motion.div>
                  ))}
                  <button
                    onClick={() => setShowMoreTags(!showMoreTags)}
                    className="text-indigo-600 text-xs font-medium mt-1 hover:underline self-end"
                  >
                    {showMoreTags ? "Show Less" : "Show More"}
                  </button>
                </motion.div>
              </div>

              {/* Upcoming Events */}
              {/* <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-semibold text-gray-800 px-2">Upcoming Events</h4>
                  <BsCalendarEvent className="text-orange-500" />
                </div>
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={index}
                    className="bg-white p-3 rounded-lg mb-2 hover:shadow-md transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium text-gray-800">{event.name}</h5>
                        <p className="text-xs text-gray-500">{event.date} • {event.attendees} attending</p>
                      </div>
                      <motion.button
                        className="bg-indigo-100 text-indigo-600 text-xs px-2 py-1 rounded-md font-medium"
                        whileHover={{ backgroundColor: "#4F46E520" }}
                      >
                        RSVP
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div> */}

              {/* User Suggestions */}
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-semibold text-gray-800 px-2">Suggested Users</h4>
                  <AiOutlineNumber className="text-blue-500" />
                </div>
                <AnimatePresence>
                  <motion.div
                    className="flex flex-col gap-2"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                  >
                    {(showMoreUsers ? reversedUsers : reversedUsers.slice(0, 3)).map((user, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={{ x: 3 }}
                        className="bg-white rounded-lg overflow-hidden"
                      >
                        <Link
                          href={`profile/${user?._id}`}
                          className="flex items-center p-2 transition cursor-pointer group"
                        >
                          <div className="relative">
                            <img
                              src={user?.profilePicture || "/default-profile.jpg"}
                              alt={user?.fullName}
                              className="rounded-full h-10 w-10 mr-2 object-cover border-2 border-white group-hover:border-indigo-200 transition-all"
                              style={{ minWidth: '40px', minHeight: '40px' }} // Ensures the image maintains a square aspect ratio
                            />
                            <div className="absolute bottom-0 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          </div>
                          <div className="flex flex-col flex-1">
                            <p className="text-gray-800 text-sm font-medium truncate">{user?.fullName}</p>
                            <span className="text-xs text-gray-500 truncate">@{user?.username}</span>
                          </div>
                          <motion.button
                            className="text-xs bg-gray-100 hover:bg-indigo-100 hover:text-indigo-600 text-gray-600 px-2 py-1 rounded-md font-medium transition-colors"
                            whileHover={{ scale: 1.05 }}
                          >
                            Follow
                          </motion.button>
                        </Link>
                      </motion.div>
                    ))}
                    <button
                      onClick={() => setShowMoreUsers(!showMoreUsers)}
                      className="text-indigo-600 text-xs font-medium mt-1 hover:underline self-end"
                    >
                      {showMoreUsers ? "Show Less" : "Show More"}
                    </button>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
          {/* Mini Sidebar - Always Visible on the left */}

          <div className="w-20 z-20">
            <div
              className="mini-sidebar w-20 py-6 px-3 bg-white/95 shadow-sm fixed overflow-y-auto rounded-xl border border-purple-100 flex flex-col items-center gap-6"
              style={{ height: "calc(100vh - 4rem)" }}
            >
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-indigo-400 p-3 rounded-xl cursor-pointer relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  2
                </span>
              </motion.div>

              <div className="flex flex-col gap-4 items-center">
                <motion.div
                  className="bg-purple-200 p-3 rounded-xl text-purple-600 cursor-pointer"
                  whileHover={{ scale: 1.1, backgroundColor: "#9333EA", color: "#ffffff" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RiHomeLine size={18} />
                </motion.div>

                <motion.div
                  className="bg-pink-100 p-3 rounded-xl text-pink-600 cursor-pointer"
                  whileHover={{ scale: 1.1, backgroundColor: "#EC4899", color: "#ffffff" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RiCompassDiscoverLine size={18} />
                </motion.div>

                <motion.div
                  className="bg-amber-100 p-3 rounded-xl text-amber-600 cursor-pointer relative"
                  whileHover={{ scale: 1.1, backgroundColor: "#F59E0B", color: "#ffffff" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RiFireLine size={18} />
                  <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    3
                  </span>
                </motion.div>

                <motion.div
                  className="bg-teal-100 p-3 rounded-xl text-teal-600 cursor-pointer"
                  whileHover={{ scale: 1.1, backgroundColor: "#14B8A6", color: "#ffffff" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RiBookmarkLine size={18} />
                </motion.div>

                <motion.div
                  className="bg-indigo-100 p-3 rounded-xl text-indigo-600 cursor-pointer"
                  whileHover={{ scale: 1.1, backgroundColor: "#6366F1", color: "#ffffff" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RiSettings4Line size={18} />
                </motion.div>
              </div>

              <div className="mt-auto border-t border-purple-200 pt-4 w-full flex flex-col items-center gap-4">
                {reversedUsers.slice(0, 3).map((user, index) => (
                  <Link key={index} href={`/profile/${user?._id}`}>
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={user?.profilePicture || "/default-profile.jpg"}
                        alt={user?.fullName}
                        className="rounded-full h-10 w-10 object-cover border-2 border-purple-200"
                      />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-purple-500 rounded-full border-2 border-white"></div>
                    </motion.div>
                  </Link>
                ))}
                <motion.div
                  className="bg-purple-200 p-2 rounded-full text-purple-600 cursor-pointer mt-1"
                  whileHover={{ scale: 1.15, backgroundColor: "#A78BFA", color: "#ffffff" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Rightbar;
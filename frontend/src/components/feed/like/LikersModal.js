import Link from "next/link";
import React, { useState } from "react";
import { FiHeart, FiSearch, FiX, FiUser } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import ModalPortal from "@/components/common/ModalPortal";

const LikersModal = ({ likers, closeModal }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredUser, setHoveredUser] = useState(null);

  const filteredLikers = likers.filter(liker =>
    liker.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.15 } }
  };

  const contentVariants = {
    hidden: { scale: 0.95, y: 20, opacity: 0 },
    visible: {
      scale: 1,
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500,
        mass: 0.5
      }
    },
    exit: {
      scale: 0.95,
      y: 20,
      opacity: 0,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 500
      }
    }
  };

  const listItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.03,
        type: "spring",
        stiffness: 400
      }
    })
  };

  return (
    <ModalPortal>
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
          onClick={closeModal}
        >
          <motion.div
            className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl border border-gray-100 overflow-hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={contentVariants}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center space-x-3">
                <motion.div
                  className="p-2.5 bg-indigo-500 rounded-full shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <FiHeart className="text-white text-lg" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {likers.length} {likers.length === 1 ? 'Like' : 'Likes'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    People who liked this post
                  </p>
                </div>
              </div>
              <motion.button
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiX size={18} className="text-gray-500" />
              </motion.button>
            </div>

            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <motion.input
                type="text"
                placeholder="Search likers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-transparent text-sm placeholder-gray-400 transition-all"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                whileFocus={{
                  boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.15)",
                  backgroundColor: "#f9fafb"
                }}
              />
              {searchTerm && (
                <motion.button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  onClick={() => setSearchTerm("")}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiX size={16} />
                </motion.button>
              )}
            </div>

            <motion.div
              className="space-y-1.5 max-h-[320px] overflow-y-auto pr-2 -mr-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#e5e7eb transparent'
              }}
            >
              {filteredLikers.length > 0 ? (
                filteredLikers.map((liker, index) => (
                  <motion.div
                    key={liker._id}
                    custom={index}
                    variants={listItemVariants}
                    initial="hidden"
                    animate="visible"
                    onMouseEnter={() => setHoveredUser(liker._id)}
                    onMouseLeave={() => setHoveredUser(null)}
                  >
                    <Link href={`/profile/${liker._id}`} passHref>
                      <motion.div
                        className="flex items-center p-2.5 rounded-lg hover:bg-gray-50 transition-all cursor-pointer group relative"
                        whileHover={{
                          x: 2,
                          backgroundColor: "#f9fafb",
                          boxShadow: "0 2px 8px -2px rgba(99, 102, 241, 0.15)"
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="relative flex-shrink-0">
                          {liker.profilePicture ? (
                            <motion.img
                              src={liker.profilePicture}
                              alt={liker.fullName}
                              className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm"
                              whileHover={{ scale: 1.05 }}
                            />
                          ) : (
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
                            >
                              <FiUser className="w-5 h-5 text-gray-400" />
                            </motion.div>
                          )}
                          <motion.div
                            className="absolute -bottom-1 -right-1 bg-indigo-500 rounded-full p-1 shadow-sm border border-white"
                            initial={{ scale: 0 }}
                            animate={{
                              scale: hoveredUser === liker._id ? 1 : 0
                            }}
                            transition={{ type: "spring", stiffness: 500 }}
                          >
                            <FiHeart className="w-2 h-2 text-white" />
                          </motion.div>
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <p className="font-medium text-gray-800 truncate text-sm">{liker.fullName}</p>
                          <motion.p
                            className="text-xs text-indigo-500 font-medium mt-0.5"
                            initial={{ x: 0 }}
                            animate={{
                              x: hoveredUser === liker._id ? 2 : 0
                            }}
                          >
                            View Profile
                          </motion.p>
                        </div>
                        <motion.div
                          className="w-6 opacity-0 group-hover:opacity-100"
                          initial={{ x: 5 }}
                          animate={{
                            x: hoveredUser === liker._id ? 0 : 5,
                            opacity: hoveredUser === liker._id ? 1 : 0
                          }}
                        >
                          <div className="text-indigo-400">→</div>
                        </motion.div>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="flex flex-col items-center justify-center py-8 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3 border border-dashed border-gray-200"
                    animate={{
                      scale: [1, 1.03, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <FiSearch className="text-gray-300 text-xl" />
                  </motion.div>
                  <p className="text-gray-600 font-medium text-sm">No matching users found</p>
                  <p className="text-gray-400 text-xs mt-1 max-w-xs">
                    {searchTerm ? `No results for "${searchTerm}"` : "Try searching for a name"}
                  </p>
                </motion.div>
              )}
            </motion.div>

            <motion.div
              className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-xs text-gray-400">
                {filteredLikers.length} of {likers.length} users
              </span>
              <motion.button
                onClick={closeModal}
                className="text-sm font-medium text-indigo-500 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </ModalPortal>
  );
};

export default LikersModal;
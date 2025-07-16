import Link from "next/link";
import React, { useState } from "react";
import { FiHeart, FiSearch, FiX, FiUser } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import ModalPortal from "@/components/common/ModalPortal";

const LikersModal = ({ likers, closeModal }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredUser, setHoveredUser] = useState(null);

  // Deduplicate likers and then filter by search term
  const uniqueLikers = likers.filter((liker, index, self) => 
    index === self.findIndex(l => l._id === liker._id)
  );
  
  const filteredLikers = uniqueLikers.filter(liker =>
    liker.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Faster animation variants
  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.15 } },
    exit: { opacity: 0, transition: { duration: 0.1 } }
  };

  const contentVariants = {
    hidden: { scale: 0.98, y: 10, opacity: 0 },
    visible: {
      scale: 1,
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 28,
        stiffness: 600,
        mass: 0.4
      }
    },
    exit: {
      scale: 0.98,
      y: 10,
      opacity: 0,
      transition: {
        duration: 0.1
      }
    }
  };

  const listItemVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.02, // Faster delay
        type: "spring",
        stiffness: 500,
        damping: 25
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
            className="bg-white p-6 rounded-2xl w-full max-w-md shadow-lg border border-gray-200 overflow-hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={contentVariants}
            onClick={e => e.stopPropagation()}
            style={{ boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 15px -8px rgba(0,0,0,0.05)" }}
          >
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center space-x-3">
                <motion.div
                  className="p-2.5 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full shadow-md"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 500 }}
                  style={{ boxShadow: "0 0 10px -2px rgba(99,102,241,0.3)" }}
                >
                  <FiHeart className="text-white text-lg" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 tracking-tight">
                    {likers.length} {likers.length === 1 ? 'Like' : 'Likes'}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    People who liked this post
                  </p>
                </div>
              </div>
              <motion.button
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiX size={18} className="text-gray-500" />
              </motion.button>
            </div>

            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-blue-500" />
              </div>
              <motion.input
                type="text"
                placeholder="Search likers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-3 focus:ring-blue-200 focus:border-blue-300 text-sm placeholder-gray-400 text-gray-700 transition-all"
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.08 }}
                whileFocus={{
                  boxShadow: "0 0 0 3px rgba(96, 165, 250, 0.15)",
                  backgroundColor: "#fafafa"
                }}
              />
              {searchTerm && (
                <motion.button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  onClick={() => setSearchTerm("")}
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 45 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiX size={16} />
                </motion.button>
              )}
            </div>

            <motion.div
              className="space-y-1.5 max-h-[320px] overflow-y-auto pr-2 -mr-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#d1d5db #f3f4f6'
              }}
            >
              {filteredLikers.length > 0 ? (
                filteredLikers.map((liker, index) => (
                  <motion.div
                    key={`${liker._id}-${index}`}
                    custom={index}
                    variants={listItemVariants}
                    initial="hidden"
                    animate="visible"
                    onMouseEnter={() => setHoveredUser(liker._id)}
                    onMouseLeave={() => setHoveredUser(null)}
                  >
                    <Link href={`/profile/${liker._id}`} passHref>
                      <motion.div
                        className="flex items-center p-3 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all cursor-pointer group relative"
                        whileHover={{
                          x: 2,
                          boxShadow: "0 2px 8px -2px rgba(99, 102, 241, 0.15)"
                        }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="relative flex-shrink-0">
                          {liker.profilePicture ? (
                            <motion.img
                              src={liker.profilePicture}
                              alt={liker.fullName}
                              className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
                              whileHover={{ scale: 1.05 }}
                              style={{ boxShadow: "0 0 0 2px rgba(99, 102, 241, 0.15)" }}
                            />
                          ) : (
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              className="w-11 h-11 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-sm"
                              style={{ boxShadow: "0 0 0 2px rgba(99, 102, 241, 0.15)" }}
                            >
                              <FiUser className="w-5 h-5 text-blue-500" />
                            </motion.div>
                          )}
                          <motion.div
                            className="absolute -bottom-1 -right-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full p-1.5 shadow-md border-2 border-white"
                            initial={{ scale: 0, rotate: -30 }}
                            animate={{
                              scale: hoveredUser === liker._id ? 1 : 0,
                              rotate: hoveredUser === liker._id ? 0 : -30
                            }}
                            transition={{ type: "spring", stiffness: 600 }}
                          >
                            <FiHeart className="w-2 h-2 text-white" />
                          </motion.div>
                        </div>
                        <div className="ml-3.5 flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 truncate text-sm">{liker.fullName}</p>
                          <motion.p
                            className="text-xs bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent font-bold mt-0.5"
                            initial={{ x: 0 }}
                            animate={{
                              x: hoveredUser === liker._id ? 1 : 0
                            }}
                          >
                            View Profile
                          </motion.p>
                        </div>
                        <motion.div
                          className="w-6 opacity-0 group-hover:opacity-100"
                          initial={{ x: 3 }}
                          animate={{
                            x: hoveredUser === liker._id ? 0 : 3,
                            opacity: hoveredUser === liker._id ? 1 : 0
                          }}
                        >
                          <div className="text-indigo-500 font-bold">→</div>
                        </motion.div>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="flex flex-col items-center justify-center py-10 text-center"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <motion.div
                    className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mb-4 border border-dashed border-gray-300"
                    animate={{
                      scale: [1, 1.03, 1],
                      rotate: [0, 3, 0, -3, 0],
                    }}
                    transition={{
                      duration: 2, // Faster animation
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <FiSearch className="text-blue-500 text-2xl" />
                  </motion.div>
                  <p className="text-gray-700 font-semibold text-sm">No matching users found</p>
                  <p className="text-gray-500 text-xs mt-1.5 max-w-xs">
                    {searchTerm ? `No results for "${searchTerm}"` : "Try searching for a name"}
                  </p>
                </motion.div>
              )}
            </motion.div>

            <motion.div
              className="mt-5 pt-3 border-t border-gray-200 flex justify-between items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-xs text-gray-500 font-medium">
                {filteredLikers.length} of {likers.length} users
              </span>
              <motion.button
                onClick={closeModal}
                className="text-sm font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ boxShadow: "0 4px 8px -2px rgba(99, 102, 241, 0.3)" }}
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
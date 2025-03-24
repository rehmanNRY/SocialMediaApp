import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { FiHeart, FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const LikersModal = ({ likers, closeModal }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredUser, setHoveredUser] = useState(null);

  const filteredLikers = likers.filter(liker => 
    liker.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeModal}
      >
        <motion.div 
          className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl border border-gray-100"
          initial={{ scale: 0.95, y: 10 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 10 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-rose-50 rounded-lg">
                <FiHeart className="text-rose-500 text-lg" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {likers.length} Likes
              </h3>
            </div>
            <button 
              onClick={closeModal} 
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full transition-colors"
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <MdClose size={22} />
            </button>
          </div>
          
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search likers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-transparent text-sm placeholder-gray-400 transition-all"
            />
          </div>
          
          <motion.div 
            className="space-y-3 max-h-[360px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {filteredLikers.length > 0 ? (
              filteredLikers.map((liker) => (
                <motion.div 
                  key={liker._id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onMouseEnter={() => setHoveredUser(liker._id)}
                  onMouseLeave={() => setHoveredUser(null)}
                >
                  <Link href={`/profile/${liker._id}`} passHref>
                    <motion.div 
                      className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-all cursor-pointer group"
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="relative flex-shrink-0">
                        {liker.profilePicture ? (
                          <motion.img
                            src={liker.profilePicture}
                            alt={liker.fullName}
                            className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm group-hover:border-rose-100 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          />
                        ) : (
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <FaUserCircle className="w-11 h-11 text-gray-300" />
                          </motion.div>
                        )}
                        <motion.div 
                          className="absolute -bottom-1 -right-1 bg-rose-500 rounded-full p-1.5 shadow-sm"
                          initial={{ scale: 0 }}
                          animate={{ scale: hoveredUser === liker._id ? 1 : 0 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          <FiHeart className="w-2.5 h-2.5 text-white" />
                        </motion.div>
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{liker.fullName}</p>
                        <p className="text-xs text-rose-500 font-medium mt-0.5">
                          View Profile →
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <motion.div 
                className="flex flex-col items-center justify-center py-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                  <FiSearch className="text-gray-300 text-xl" />
                </div>
                <p className="text-gray-500 font-medium">No results for</p>
                <p className="text-gray-400 text-sm">"{searchTerm}"</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LikersModal;
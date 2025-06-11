"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { createStory } from "@/redux/story/storySlice";
import Link from "next/link";
import { 
  FiX, 
  FiSave, 
  FiImage, 
  FiFeather, 
  FiCheck, 
  FiAlertCircle, 
  FiArrowLeft, 
  FiLink
} from "react-icons/fi";

const StoryForm = ({ isOpen, onClose, storyToast }) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [showImageInput, setShowImageInput] = useState(true);
  const [charCount, setCharCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessIndicator, setShowSuccessIndicator] = useState(false);
  
  const { isLoading, error } = useSelector((state) => state.story);
  const { userDetails } = useSelector((state) => state.auth);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setContent("");
      setImage("");
      setShowImageInput(true);
      setCharCount(0);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Dispatch the createStory action
    const resultAction = await dispatch(createStory({ content, image }));

    // Check if the story was successfully posted
    if (createStory.fulfilled.match(resultAction)) {
      setShowSuccessIndicator(true);
      setTimeout(() => {
        setShowSuccessIndicator(false);
        onClose();
      }, 1200);
      storyToast("success");
    } else if (createStory.rejected.match(resultAction)) {
      storyToast("error");
      setIsSubmitting(false);
    }
  };

  const handleContentChange = (e) => {
    const text = e.target.value;
    if (text.length <= 100) {
      setContent(text);
      setCharCount(text.length);
    }
  };

  const handleClearImage = () => {
    setImage("");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl p-7 w-full max-w-[42rem] shadow-2xl mx-4 border border-gray-100"
        >
          <div className="flex justify-between items-center mb-7">
            <div className="flex items-center gap-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <img
                  className="w-16 h-16 object-cover rounded-full shadow-lg ring-3 ring-indigo-100"
                  src={userDetails?.profilePicture || 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg'}
                  alt={userDetails?.fullName}
                />
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="absolute bottom-0 right-0 w-5 h-5 bg-green-400 rounded-full border-2 border-white"
                ></motion.div>
              </motion.div>
              <div>
                <motion.h3 
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="font-bold text-2xl text-gray-900"
                >
                  Create Story
                </motion.h3>
                <motion.p 
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm text-gray-500"
                >
                  Share a moment with your friends
                </motion.p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors bg-white/80 p-2 rounded-full shadow-sm"
            >
              <FiX className="w-6 h-6" />
            </motion.button>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FiFeather className="text-indigo-500" />
                  Your Story
                </label>
                <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                  charCount > 90 ? 'bg-red-100 text-red-600' : 
                  charCount > 70 ? 'bg-yellow-100 text-yellow-600' : 
                  'bg-green-100 text-green-600'
                }`}>
                  {charCount}/100
                </span>
              </div>
              <motion.div
                whileHover={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                className="relative"
              >
                <motion.textarea
                  initial={{ height: "150px" }}
                  animate={{ height: content.length > 80 ? "180px" : "150px" }}
                  value={content}
                  onChange={handleContentChange}
                  rows={3}
                  className="w-full p-5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-gray-700 shadow-sm"
                  placeholder="Write your story here..."
                />
                {charCount >= 100 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-3 bottom-3 text-red-500 flex items-center gap-1 text-sm bg-white/90 px-2 py-1 rounded-lg"
                  >
                    <FiAlertCircle />
                    <span>Character limit reached</span>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FiImage className="text-indigo-500" />
                  Story Image
                </label>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowImageInput(!showImageInput)}
                  className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-indigo-50 transition-all"
                >
                  {showImageInput ? <FiX size={14} /> : <FiImage size={14} />}
                  <span>{showImageInput ? "Remove Image" : "Add Image"}</span>
                </motion.button>
              </div>
              
              <AnimatePresence>
                {showImageInput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <FiLink size={16} />
                      </div>
                      <input
                        type="text"
                        placeholder="Enter image URL..."
                        className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-700 shadow-sm"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        maxLength={300}
                      />
                      {image && (
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handleClearImage}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <FiX size={16} />
                        </motion.button>
                      )}
                    </div>
                    
                    {image && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 rounded-xl overflow-hidden border border-gray-200 h-32 bg-gray-50"
                      >
                        <img 
                          src={image}
                          alt="Story preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL';
                          }}
                        />
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm"
            >
              <FiAlertCircle />
              <span>{error}</span>
            </motion.div>
          )}

          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-end gap-3 mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: "#f3f4f6" }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium transition-colors flex items-center gap-2 shadow-sm"
            >
              <FiX className="w-4 h-4" />
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: "#4338ca" }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={isSubmitting || content.trim() === ""}
              className={`px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-md relative overflow-hidden ${
                isSubmitting || content.trim() === "" ? 'opacity-70' : ''
              }`}
            >
              {showSuccessIndicator ? (
                <>
                  <FiCheck className="w-4 h-4" />
                  Posted!
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  {isSubmitting ? 'Posting...' : 'Post Story'}
                </>
              )}
              {isSubmitting && (
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1 }}
                  className="absolute bottom-0 left-0 h-1 bg-white/30"
                />
              )}
            </motion.button>
          </motion.div>

          {/* Back Home Link */}
          <Link href="/">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute top-4 left-4 md:right-4 md:left-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-full shadow-sm hover:shadow transition duration-200 flex items-center text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiArrowLeft className="mr-1.5" />
              Back Home
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StoryForm;

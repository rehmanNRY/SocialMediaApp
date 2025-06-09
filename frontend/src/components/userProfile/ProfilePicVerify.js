"use client"
import React, { useState, useEffect, useRef } from 'react'
import { IoImageOutline, IoImageSharp, IoCheckmarkCircle, IoLink, IoGrid } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { CiImageOn } from "react-icons/ci";
import { BiX } from 'react-icons/bi';
import { FiSearch, FiZoomIn, FiLink } from 'react-icons/fi';
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateUserDetails } from "@/redux/auth/authSlice";
import { motion, AnimatePresence } from "framer-motion";

const ProfilePicVerify = () => {
  const profilePictures = [
    "https://res.cloudinary.com/datvbo0ey/image/upload/v1726651745/3d%20avatar/1_ijpza2.png",
    "https://img.freepik.com/premium-photo/3d-avatar-boy-character_914455-603.jpg",
    "https://res.cloudinary.com/datvbo0ey/image/upload/v1726651746/3d%20avatar/8_ff3tta.png",
    "https://res.cloudinary.com/datvbo0ey/image/upload/v1726651745/3d%20avatar/3_bmxh2t.png",
    "https://res.cloudinary.com/datvbo0ey/image/upload/v1726651746/3d%20avatar/9_s4mvtd.png",
    "https://res.cloudinary.com/datvbo0ey/image/upload/v1726651746/3d%20avatar/7_uimci3.png",
    "https://res.cloudinary.com/datvbo0ey/image/upload/v1726651745/3d%20avatar/4_d2vuip.png",
    "https://res.cloudinary.com/datvbo0ey/image/upload/v1726651746/3d%20avatar/5_xhf1vy.png",
    "https://res.cloudinary.com/datvbo0ey/image/upload/v1726651746/3d%20avatar/6_pksp2n.png",
  ];

  const dispatch = useDispatch();
  const { isLoggedIn, userDetails } = useSelector((state) => state.auth);
  const assignedProfilePicture = profilePictures.find((pic) => pic === userDetails?.profilePicture) || "https://res.cloudinary.com/datvbo0ey/image/upload/v1726651745/3d%20avatar/1_ijpza2.png";
  
  const [currentPic, setCurrentPic] = useState(assignedProfilePicture);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(
    profilePictures.findIndex(pic => pic === assignedProfilePicture)
  );
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('gallery');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [customImageError, setCustomImageError] = useState('');
  const [isCustomImageValid, setIsCustomImageValid] = useState(false);
  const [newImageFile, setNewImageFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const previewRef = useRef(null);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const authToken = localStorage.getItem("authToken");
      if (newImageFile) {
        // Upload via Cloudinary (multer) then set verify flag
        const formData = new FormData();
        formData.append('profilePicture', newImageFile);
        const uploadRes = await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/api/user/update/avatar`,
          formData,
          { headers: { 'auth-token': authToken } }
        );
        const verifyRes = await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/api/user/update`,
          { isDpVerify: true },
          { headers: { 'auth-token': authToken } }
        );
        dispatch(updateUserDetails(verifyRes.data.data || uploadRes.data.data));
      } else {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/api/user/update`,
          { profilePicture: currentPic, isDpVerify: true },
          {
            headers: {
              "auth-token": authToken,
            },
          }
        );
        dispatch(updateUserDetails(response.data.data));
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error("Error updating user details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePictureSelect = (pic, index) => {
    setCurrentPic(pic);
    setSelectedIndex(index);
    setCustomImageError('');
    setNewImageFile(null);
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const handleCustomImageSubmit = () => {
    if (!customImageUrl.trim()) {
      setCustomImageError('Please enter an image URL');
      return;
    }

    // Basic URL validation
    if (!/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(customImageUrl)) {
      setCustomImageError('Please enter a valid image URL (jpg, png, webp, gif)');
      return;
    }

    setIsCustomImageValid(true);
    setCurrentPic(customImageUrl);
    setCustomImageError('');
    setNewImageFile(null);
  };

  const handleFiles = (files) => {
    const file = files && files[0];
    if (!file) return;
    setNewImageFile(file);
    setCustomImageUrl('');
    setCustomImageError('');
    const localUrl = URL.createObjectURL(file);
    setCurrentPic(localUrl);
  };

  // Close preview when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showPreview && previewRef.current && !previewRef.current.contains(e.target)) {
        setShowPreview(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPreview]);

  // Test an image URL
  const testImageUrl = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  // Validate custom image URL
  useEffect(() => {
    if (customImageUrl) {
      const timer = setTimeout(async () => {
        const isValid = await testImageUrl(customImageUrl);
        setIsCustomImageValid(isValid);
        if (!isValid && customImageUrl.trim() !== '') {
          setCustomImageError('Unable to load this image. Please check the URL.');
        } else {
          setCustomImageError('');
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [customImageUrl]);

  if (!isLoggedIn || !userDetails || userDetails.isDpVerify) return null;
  
  return (
    <AnimatePresence>
      <motion.div 
        className='h-screen w-screen fixed z-30 bg-black/80 top-0 left-0 flex items-center justify-center backdrop-blur-sm'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-6 relative overflow-hidden"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", damping: 25 }}
        >
          <div className="absolute top-4 right-4 z-10">
            <motion.button 
              onClick={handleSave} 
              className='p-2 rounded-full hover:bg-gray-100 transition-colors'
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <BiX size={24} />
            </motion.button>
          </div>

          <div className="flex items-center mb-6">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
            >
              <img 
                src={currentPic} 
                alt="Selected avatar" 
                className="h-20 w-20 rounded-full border-4 border-blue-500 shadow-md object-cover" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = assignedProfilePicture;
                  setCustomImageError('Failed to load this image. Please try another URL.');
                }}
              />
              <motion.div 
                className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <IoCheckmarkCircle size={16} />
              </motion.div>
            </motion.div>
            <div className="ml-4">
              <h2 className='font-bold text-2xl mb-1'>Choose Your Avatar</h2>
              <p className="text-gray-500 text-sm">Pick a profile picture that represents you</p>
            </div>
          </div>

          {showPreview && (
            <motion.div 
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPreview(false)}
            >
              <motion.div
                ref={previewRef}
                onClick={(e) => e.stopPropagation()}
              >
                <motion.img 
                  src={currentPic} 
                  alt="Preview" 
                  className="max-h-[80vh] max-w-[80vw] rounded-lg shadow-2xl"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                />
              </motion.div>
              <button 
                onClick={() => setShowPreview(false)}
                className="absolute top-6 right-6 text-white p-2 rounded-full bg-black/50 hover:bg-black/70"
              >
                <BiX size={24} />
              </button>
            </motion.div>
          )}

          {/* Tabs */}
          <div className="mb-4 border-b border-gray-200">
            <div className="flex space-x-2">
              <motion.button
                className={`py-2 px-4 font-medium flex items-center gap-2 relative ${
                  activeTab === 'gallery' 
                    ? 'text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('gallery')}
                whileHover={{ y: -1 }}
                whileTap={{ y: 1 }}
              >
                <IoGrid />
                <span>Gallery</span>
                {activeTab === 'gallery' && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                    layoutId="activeTabIndicator"
                  />
                )}
              </motion.button>
              
              <motion.button
                className={`py-2 px-4 font-medium flex items-center gap-2 relative ${
                  activeTab === 'custom' 
                    ? 'text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('custom')}
                whileHover={{ y: -1 }}
                whileTap={{ y: 1 }}
              >
                <FiLink />
                <span>Custom Image</span>
                {activeTab === 'custom' && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                    layoutId="activeTabIndicator"
                  />
                )}
              </motion.button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'gallery' ? (
              <motion.div 
                key="gallery"
                className="mb-6 bg-gray-50 p-4 rounded-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <motion.div 
                  className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3"
                >
                  {profilePictures.map((pic, index) => (
                    <motion.div
                      key={pic}
                      className={`relative cursor-pointer`}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      animate={currentPic === pic ? { y: [0, -5, 0] } : {}}
                      transition={{ 
                        duration: 0.4,
                        ease: "easeInOut",
                      }}
                    >
                      <div 
                        className={`relative overflow-hidden rounded-lg ${
                          currentPic === pic ? 'ring-4 ring-blue-500 shadow-lg' : 'ring-2 ring-transparent hover:ring-blue-300'
                        }`}
                        onClick={() => handlePictureSelect(pic, index)}
                      >
                        <img src={pic} alt={`Avatar ${index + 1}`} className='aspect-square object-cover' />
                        
                        <motion.div 
                          className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-all duration-200"
                          whileHover={{ opacity: 1 }}
                          initial={{ opacity: 0 }}
                        >
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentPic(pic);
                              togglePreview();
                            }}
                            className="p-2 bg-white/90 rounded-full"
                            whileHover={{ scale: 1.1 }}
                          >
                            <FiZoomIn size={16} className="text-blue-600" />
                          </motion.button>
                        </motion.div>
                      </div>
                      
                      {currentPic === pic && (
                        <motion.div 
                          className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <IoCheckmarkCircle size={14} />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ) : (
              <motion.div 
                key="custom"
                className="mb-6 bg-gray-50 p-4 rounded-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Choose from device / Drag & drop
                      </label>
                      <div
                        className={`border-2 border-dashed rounded-lg p-4 text-center ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
                      >
                        <p className="text-gray-600 mb-2">Drag & drop an image here, or</p>
                        <label className="inline-block px-3 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700">
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFiles(e.target.files)} />
                          Choose file
                        </label>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                        Image URL
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="imageUrl"
                          value={customImageUrl}
                          onChange={(e) => setCustomImageUrl(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className={`w-full p-3 border ${customImageError ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiLink className="text-gray-400" />
                        </div>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <motion.button
                          onClick={handleCustomImageSubmit}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={!isCustomImageValid && customImageUrl.trim() !== ''}
                        >
                          <IoImageOutline />
                          <span>Apply URL</span>
                        </motion.button>
                      </div>
                      {customImageError && (
                        <motion.p 
                          className="mt-2 text-sm text-red-600"
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {customImageError}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  {(newImageFile || (customImageUrl && isCustomImageValid)) && (
                    <motion.div 
                      className="mt-4 flex justify-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div className="relative inline-block">
                        <img 
                          src={newImageFile ? currentPic : customImageUrl} 
                          alt="Custom profile picture" 
                          className="h-40 w-40 object-cover rounded-lg shadow-md" 
                          onClick={togglePreview}
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/30 transition-opacity rounded-lg">
                          <button 
                            onClick={togglePreview}
                            className="p-2 bg-white rounded-full"
                          >
                            <FiSearch size={18} className="text-blue-600" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            className="flex justify-between gap-3 mt-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.button 
              onClick={() => {
                setCurrentPic(assignedProfilePicture);
                setSelectedIndex(profilePictures.findIndex(pic => pic === assignedProfilePicture));
                setCustomImageUrl('');
                setCustomImageError('');
              }} 
              type="button" 
              className="flex-1 bg-white text-blue-600 border-2 border-blue-600 font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 transition duration-200 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <IoImageSharp /> Reset Default
            </motion.button>
            
            <motion.button 
              onClick={handleSave} 
              type="button" 
              className="flex-1 bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2 relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <motion.div 
                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span>Saving...</span>
                </>
              ) : success ? (
                <>
                  <IoCheckmarkCircle size={20} />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <CiImageOn size={20} />
                  <span>Save Selection</span>
                </>
              )}
              
              <motion.div
                className="absolute inset-0 bg-blue-500"
                initial={{ x: "-100%" }}
                animate={isLoading ? { x: "0%" } : { x: "-100%" }}
                transition={{ duration: 0.5 }}
              />
            </motion.button>
          </motion.div>

          {success && (
            <motion.div 
              className="mt-4 p-3 rounded-lg bg-green-100 text-green-800 flex items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <IoCheckmarkCircle size={18} />
              <span>Profile picture updated successfully!</span>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ProfilePicVerify
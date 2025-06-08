"use client"
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  FaUserCog,
  FaEnvelope,
  FaBirthdayCake,
  FaMapMarkerAlt,
  FaUserFriends,
  FaUserPlus,
  FaUserMinus,
  FaInfoCircle,
  FaUserEdit,
  FaCamera,
  FaImage,
  FaAddressCard,
  FaKey,
  FaPen,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronRight, FiLogOut, FiSave, FiX } from "react-icons/fi";
import AuthRedirect from '@/components/AuthRedirect';
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails, updateUserDetails } from "@/redux/auth/authSlice";
import Link from "next/link";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchFriendsList, fetchReceivedRequests, fetchSentRequests } from "@/redux/friendRequests/friendRequestsSlice";
import { fetchUsers } from "@/redux/users/usersSlice";

const SettingsPage = () => {
  const [activeField, setActiveField] = useState(null);
  const dispatch = useDispatch();
  const { isLoggedIn, userDetails, loading, error } = useSelector((state) => state.auth);
  const sentRequests = useSelector((state) => state.friendRequests.sentRequests);
  const receivedRequests = useSelector((state) => state.friendRequests.receivedRequests);
  const friendsList = useSelector((state) => state.friendRequests.friendsList);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    profilePicture: "",
    coverImage: "",
    dob: "",
    location: "",
    bio: "",
  });

  useEffect(() => {
    dispatch(fetchUserDetails());
    dispatch(fetchSentRequests());
    dispatch(fetchReceivedRequests());
    dispatch(fetchFriendsList());
  }, [dispatch]);

  useEffect(() => {
    if (userDetails) {
      setFormData({
        username: userDetails.username || "",
        email: userDetails.email || "",
        password: "",
        fullName: userDetails.fullName || "",
        profilePicture: userDetails.profilePicture || "",
        coverImage: userDetails.coverImage || "",
        dob: userDetails.dob || "",
        location: userDetails.location || "",
        bio: userDetails.bio || "",
      });
    }
  }, [userDetails]);

  const handleEdit = (field) => {
    setActiveField(field);
  };

  const handleCancel = () => {
    setActiveField(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [activeField]: e.target.value });
  };

  const [errors, setErrors] = useState({});

  const [newImagePreview, setNewImagePreview] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleSave = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/user/update`,
        { [activeField]: formData[activeField] },
        {
          headers: {
            "auth-token": authToken,
          },
        }
      );
      dispatch(updateUserDetails(response.data.data));
      setActiveField(null);
      setErrors({}); // Clear errors after successful update
      toast.success(`${activeField.charAt(0).toUpperCase() + activeField.slice(1)} updated successfully!`);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        // Capture the validation errors
        setErrors(error.response.data.errors);
      } else {
        console.error("Error updating user details:", error);
        toast.error("Failed to update. Please try again.");
      }
    }
  };

  const handleFiles = useCallback((files) => {
    const file = files && files[0];
    if (!file) return;
    setNewImageUrl("");
    setNewImageFile(file);
    const url = URL.createObjectURL(file);
    setNewImagePreview(url);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }, [handleFiles]);

  const submitImageUpdate = async (field) => {
    if (!field) return;
    try {
      const authToken = localStorage.getItem("authToken");
      let response;
      if (newImageFile) {
        const formData = new FormData();
        formData.append(field, newImageFile);
        const endpoint = field === 'profilePicture' ? 'avatar' : 'cover';
        response = await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/api/user/update/${endpoint}`,
          formData,
          { headers: { "auth-token": authToken } }
        );
      } else if (newImageUrl) {
        const payload = { [field]: newImageUrl };
        const endpoint = field === 'profilePicture' ? 'avatar' : 'cover';
        response = await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/api/user/update/${endpoint}`,
          payload,
          { headers: { "auth-token": authToken } }
        );
      } else {
        toast.error("Please choose an image or provide a URL");
        return;
      }
      dispatch(updateUserDetails(response.data.data));
      toast.success(`${field === 'profilePicture' ? 'Profile picture' : 'Cover image'} updated successfully!`);
      // reset and close inline edit
      setNewImagePreview(null);
      setNewImageFile(null);
      setNewImageUrl("");
      setIsDragging(false);
      setActiveField(null);
    } catch (error) {
      console.error("Image update error", error);
      toast.error("Failed to update image. Please try again.");
    }
  };

  const renderEditForm = (field) => {
    if (activeField !== field) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="mt-4 p-4 bg-gray-100 rounded-lg shadow-inner"
      >
        {(field === 'profilePicture' || field === 'coverImage') ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Current</p>
                <div className="border rounded-lg overflow-hidden bg-white">
                  <img
                    src={field === 'profilePicture' ? (userDetails?.profilePicture || 'https://via.placeholder.com/150') : (userDetails?.coverImage || 'https://via.placeholder.com/300x120')}
                    alt="Current"
                    className="w-full h-40 object-cover"
                  />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">New</p>
                <div
                  className={`border-2 border-dashed rounded-lg p-4 text-center ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-white'}`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={onDrop}
                >
                  {newImagePreview ? (
                    <img src={newImagePreview} alt="New" className="w-full h-40 object-cover rounded" />
                  ) : (
                    <>
                      <p className="text-gray-600 mb-2">Drag & drop image here, or</p>
                      <label className="inline-block px-3 py-2 bg-indigo-600 text-white rounded cursor-pointer hover:bg-indigo-700">
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFiles(e.target.files)} />
                        Choose file
                      </label>
                    </>
                  )}
                </div>
                <div className="mt-3">
                  <input
                    type="text"
                    placeholder="Or paste image URL"
                    value={newImageUrl}
                    onChange={(e) => { setNewImageUrl(e.target.value); setNewImageFile(null); setNewImagePreview(e.target.value || null); }}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => submitImageUpdate(field)} className="px-4 py-2 rounded-lg bg-indigo-600 text-white">Update</button>
              <button onClick={handleCancel} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800">Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <input
              type={field === "password" ? "password" : "text"}
              placeholder={`Enter new ${field} ${field === 'dob' ? 'DD/MM/YYYY' : ''}`}
              className={`w-full p-3 mb-2 border ${errors[field] ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
              value={formData[field]}
              onChange={handleInputChange}
            />
            {errors[field] && <p className="text-red-500 text-sm">{errors[field].message}</p>}
            <div className="flex gap-4 mt-4">
              <motion.button
                onClick={handleSave}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiSave className="inline mr-1" /> Save Changes
              </motion.button>
              <motion.button
                onClick={handleCancel}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiX className="inline mr-1" /> Cancel
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    );
  };

  const SettingItem = ({ title, icon, field, value }) => (
    <motion.li
      className={`flex justify-between items-center ${(field === "profilePicture" || field === "coverImage") ? 'py-4 pr-4' : "p-4"} bg-white rounded-lg hover:bg-gray-50 transition duration-200 shadow-sm`}
      whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
      onClick={() => handleEdit(field)}
    >
      {field !== "profilePicture" ? field === "coverImage" ? (
        <div className="flex items-center">
          <div className="relative mx-auto w-16 h-14">
            <motion.div
              className="relative w-full h-full rounded-md overflow-hidden shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <img
                src={userDetails?.coverImage || "https://via.placeholder.com/100"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </motion.div>
            {/* Camera icon kept only as a visual affordance; editing is inline below */}
            <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1.5 rounded-full shadow-lg">
              <FaCamera size={14} />
            </div>
          </div>
          <div className="flex flex-col ml-3">
            <span className="flex items-center gap-3 text-gray-700 font-medium">
              {title}
            </span>
            <span className="text-sm text-gray-500 mt-1">
              {field === "password" ? "••••••••" : value || "Not set"}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <span className="flex items-center gap-3 text-gray-700 font-medium">
            {icon}
            {title}
          </span>
          <span className="text-sm text-gray-500 mt-1 ml-7">
            {field === "password" ? "••••••••" : value || "Not set"}
          </span>
        </div>
      ) : (
        <div className="flex items-center">
          <div className="relative mx-auto w-16 h-16">
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-indigo-600 opacity-70"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <img
                src={userDetails?.profilePicture || "https://via.placeholder.com/100"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1.5 rounded-full shadow-lg">
              <FaCamera size={14} />
            </div>
          </div>
          <div className="flex flex-col ml-3">
            <span className="flex items-center gap-3 text-gray-700 font-medium">
              {title}
            </span>
            <span className="text-sm text-gray-500 mt-1">
              {field === "password" ? "••••••••" : value || "Not set"}
            </span>
          </div>
        </div>
      )}
      <motion.button
        className="text-blue-600 bg-blue-50 p-2 rounded-full"
        whileHover={{ rotate: 15 }}
      >
        <FaPen size={14} />
      </motion.button>
    </motion.li>
  );

  return (
    <AuthRedirect>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="mx-auto bg-gradient-to-b from-[#F5F6FA] via-[#F0F4FF] to-[#EEF2FF] shadow-xl rounded-2xl overflow-hidden min-h-screen w-full px-8 pt-8 pb-14 grid grid-cols-1 md:grid-cols-2 gap-3">
        <motion.div
          className="setting-item bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100"
          whileHover={{ y: -5 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-6 pb-3 border-b border-gray-100">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaAddressCard className="text-blue-600" />
            </div>
            <span>Personal Details</span>
          </h2>
          <ul className="space-y-4">
            <SettingItem
              title="Profile Picture"
              icon={<FaCamera className="text-indigo-500" />}
              field="profilePicture"
              value={userDetails?.profilePicture ? "Uploaded" : "No image"}
            />
            <SettingItem
              title="Cover Image"
              icon={<FaImage className="text-indigo-500" />}
              field="coverImage"
              value={userDetails?.coverImage ? "Uploaded" : "No image"}
            />
            <SettingItem
              title="Full Name"
              icon={<FaUserEdit className="text-indigo-500" />}
              field="fullName"
              value={userDetails?.fullName}
            />
          </ul>
          <AnimatePresence>
            {renderEditForm("fullName")}
            {renderEditForm("profilePicture")}
            {renderEditForm("coverImage")}
          </AnimatePresence>
        </motion.div>

        <motion.div
          className="setting-item bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100"
          whileHover={{ y: -5 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-6 pb-3 border-b border-gray-100">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaUserCog className="text-blue-600" />
            </div>
            <span>Account Information</span>
          </h2>
          <ul className="space-y-4">
            <SettingItem
              title="Username"
              icon={<FaUserEdit className="text-indigo-500" />}
              field="username"
              value={userDetails?.username}
            />
            <SettingItem
              title="Email Address"
              icon={<FaEnvelope className="text-indigo-500" />}
              field="email"
              value={userDetails?.email}
            />
            <SettingItem
              title="Password"
              icon={<FaKey className="text-indigo-500" />}
              field="password"
              value="password"
            />
          </ul>
          <AnimatePresence>
            {renderEditForm("username")}
            {renderEditForm("email")}
            {renderEditForm("password")}
          </AnimatePresence>
        </motion.div>

        <motion.div
          className="setting-item bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100"
          whileHover={{ y: -5 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-6 pb-3 border-b border-gray-100">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaInfoCircle className="text-blue-600" />
            </div>
            <span>Demographic Information</span>
          </h2>
          <ul className="space-y-4">
            <SettingItem
              title="Date of Birth"
              icon={<FaBirthdayCake className="text-indigo-500" />}
              field="dob"
              value={userDetails?.dob}
            />
            <SettingItem
              title="Location"
              icon={<FaMapMarkerAlt className="text-indigo-500" />}
              field="location"
              value={userDetails?.location}
            />
            <SettingItem
              title="Bio/Description"
              icon={<FaInfoCircle className="text-indigo-500" />}
              field="bio"
              value={userDetails?.bio}
            />
          </ul>          <AnimatePresence>
            {renderEditForm("dob")}
            {renderEditForm("location")}
            {renderEditForm("bio")}
          </AnimatePresence>
        </motion.div>

        <motion.div
          className="setting-item bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100"
          whileHover={{ y: -5 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-6 pb-3 border-b border-gray-100">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaUserFriends className="text-blue-600" />
            </div>
            <span>Social Connections</span>
          </h2>
          <ul className="space-y-4">
            {[
              { title: "Friends", icon: <FaUserPlus className="text-indigo-500" />, href: "/friends", count: friendsList.length },
              { title: "Followers", icon: <FaUserMinus className="text-indigo-500" />, href: "/pending-requests", count: receivedRequests.length },
              { title: "Following", icon: <FaUserFriends className="text-indigo-500" />, href: "/sent-requests", count: sentRequests.length },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
              >
                <Link
                  href={item.href}
                  className="flex justify-between items-center p-4 bg-white rounded-xl hover:bg-blue-50 transition duration-200 shadow-sm border border-gray-100"
                >
                  <span className="flex items-center gap-3 text-gray-700 font-medium">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      {item.icon}
                    </div>
                    {item.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-semibold">
                      {item.count}
                    </span>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="bg-blue-50 p-2 rounded-full"
                    >
                      <FiChevronRight className="text-blue-600" />
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </ul>
        </motion.div>
      </div>
    </AuthRedirect>
  );
};

export default SettingsPage;

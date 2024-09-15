"use client"
import React, { useState } from "react";
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
} from "react-icons/fa";
import { motion } from "framer-motion";
import { FiChevronRight, FiSave, FiX } from "react-icons/fi";
import AuthRedirect from '@/components/AuthRedirect';
import { useDispatch } from "react-redux";
import { updateUserDetails } from "@/redux/auth/authSlice";

const SettingsPage = () => {
  const [activeField, setActiveField] = useState(null);
  const dispatch = useDispatch();
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

  const handleEdit = (field) => {
    setActiveField(field);
  };

  const handleCancel = () => {
    setActiveField(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [activeField]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/user/update`,
        { ...formData },
        {
          headers: {
            "auth-token": authToken,
          },
        }
      );
      console.log(response.data);
      dispatch(updateUserDetails(response.data.data));
      setActiveField(null);
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  const renderEditForm = (field) => {
    if (activeField !== field) return null;

    return (
      <div className="mt-4 p-4 bg-gray-200 rounded-lg">
        <input
          type="text"
          placeholder={`Enter new ${field} ${field === 'dob' ? 'DD/MM/YYYY' : ''}`}
          className="w-full p-2 mb-4 border border-gray-400 rounded-lg"
          value={formData[field]}
          onChange={handleInputChange}
        />
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            <FiSave className="inline mr-1" /> Save Changes
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg"
          >
            <FiX className="inline mr-1" /> Cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <AuthRedirect>
      <div className="mx-auto bg-[#F5F6FA] shadow-lg rounded-lg overflow-hidden min-h-screen w-full">
          <div className="settings-categories grid grid-cols-1 gap-6 p-8">
            <motion.div
              className="setting-item bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition duration-200"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <FaUserCog className="text-blue-600" /> Account Information
              </h2>
              <ul className="space-y-3">
                {[
                  { title: "Username", icon: <FaUserEdit />, field: "username" },
                  { title: "Email Address", icon: <FaEnvelope />, field: "email" },
                  { title: "Password", icon: <FaKey />, field: "password" },
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-200"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleEdit(item.field)}
                  >
                    <span className="flex items-center gap-3">
                      {item.icon}
                      {item.title}
                    </span>
                    <button className="text-blue-600 font-semibold text-sm hover:underline">
                      Modify
                    </button>
                  </motion.li>
                ))}
              </ul>
              {renderEditForm("username")}
              {renderEditForm("email")}
              {renderEditForm("password")}
            </motion.div>

            <motion.div
              className="setting-item bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition duration-200"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <FaAddressCard className="text-blue-600" /> Personal Details
              </h2>
              <ul className="space-y-3">
                {[
                  { title: "Full Name", icon: <FaUserEdit />, field: "fullName" },
                  {
                    title: "Profile Picture",
                    icon: <FaCamera />,
                    field: "profilePicture",
                  },
                  { title: "Cover Image", icon: <FaImage />, field: "coverImage" },
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-200"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleEdit(item.field)}
                  >
                    <span className="flex items-center gap-3">
                      {item.icon}
                      {item.title}
                    </span>
                    <button className="text-blue-600 font-semibold text-sm hover:underline">
                      Adjust
                    </button>
                  </motion.li>
                ))}
              </ul>
              {renderEditForm("fullName")}
              {renderEditForm("profilePicture")}
              {renderEditForm("coverImage")}
            </motion.div>

            <motion.div
              className="setting-item bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition duration-200"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <FaInfoCircle className="text-blue-600" /> Demographic Information
              </h2>
              <ul className="space-y-3">
                {[
                  {
                    title: "Date of Birth",
                    icon: <FaBirthdayCake />,
                    field: "dob",
                  },
                  { title: "Location", icon: <FaMapMarkerAlt />, field: "location" },
                  { title: "Bio/Description", icon: <FaInfoCircle />, field: "bio" },
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-200"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleEdit(item.field)}
                  >
                    <span className="flex items-center gap-3">
                      {item.icon}
                      {item.title}
                    </span>
                    <button className="text-blue-600 font-semibold text-sm hover:underline">
                      Revise
                    </button>
                  </motion.li>
                ))}
              </ul>
              {renderEditForm("dob")}
              {renderEditForm("location")}
              {renderEditForm("bio")}
            </motion.div>

            <motion.div
              className="setting-item bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition duration-200"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <FaUserFriends className="text-blue-600" /> Social Connections
              </h2>
              <ul className="space-y-3">
                {[
                  { title: "Friends", icon: <FaUserPlus /> },
                  { title: "Followers", icon: <FaUserMinus /> },
                  { title: "Following", icon: <FaUserFriends /> },
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-200"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="flex items-center gap-3">
                      {item.icon}
                      {item.title}
                    </span>
                    <FiChevronRight className="text-gray-600" />
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
      </div>
    </AuthRedirect>
  );
};

export default SettingsPage;
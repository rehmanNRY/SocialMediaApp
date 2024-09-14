"use client";
import React, { useEffect } from 'react';
import { FiUserCheck, FiEye } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { fetchSentRequests, cancelSentRequest } from '@/redux/friendRequests/friendRequestsSlice';
import { useDispatch, useSelector } from 'react-redux';
import AuthRedirect from '@/components/AuthRedirect';

const SentRequests = () => {
  const dispatch = useDispatch();
  const sentRequests = useSelector((state) => state.friendRequests.sentRequests);

  useEffect(() => {
    dispatch(fetchSentRequests());
  }, [dispatch]);

  // Handle cancel sent request
  const handleCancelRequest = (requestId) => {
    dispatch(cancelSentRequest(requestId));
  };

  return (
    <AuthRedirect>
      <section className="sent-requests bg-gradient-to-b from-white to-gray-100 p-8 rounded-xl shadow-xl w-full h-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Sent Friend Requests</h2>
        {sentRequests.length > 0 ? (
          <ul className="grid grid-cols-1 gap-6">
            {sentRequests.map((user) => (
              <motion.li
                key={user._id}
                className="flex items-center justify-between p-5 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                {/* User Info */}
                <div className="flex items-center">
                  <motion.img
                    src={user.receiver.profilePicture}
                    alt={user.receiver.fullName}
                    className="w-16 h-16 rounded-full border-2 border-blue-500 shadow-md mr-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-700 text-lg">{user.receiver.fullName}</h3>
                    <p className="text-sm text-gray-500">{user.receiver.username}</p>
                    <p className="text-xs text-gray-400">{user.receiver.bio}</p>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleCancelRequest(user._id)}
                    className="flex items-center px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-full hover:bg-red-50 transition duration-200"
                  >
                    <FiUserCheck className="mr-2 w-5 h-5" />
                    Cancel
                  </button>
                  <button className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition duration-200">
                    <FiEye className="mr-2 w-5 h-5" />
                    View Profile
                  </button>
                </div>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-lg text-gray-500">No sent friend requests</p>
        )}
      </section>
    </AuthRedirect>
  );
};

export default SentRequests;
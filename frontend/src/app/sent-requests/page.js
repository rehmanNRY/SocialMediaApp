"use client";
import React, { useEffect } from 'react';
import { FiUserCheck, FiEye } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { fetchSentRequests, cancelSentRequest } from '@/redux/friendRequests/friendRequestsSlice';
import { useDispatch, useSelector } from 'react-redux';
import AuthRedirect from '@/components/AuthRedirect';
import Link from 'next/link';

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
      <section className="sent-requests bg-[#F5F6FA] p-8 w-full h-full"
      style={{ minHeight: "calc(100vh - 4.5rem)" }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Sent Friend Requests</h2>
        {sentRequests.length > 0 ? (
          <ul className="grid grid-cols-1 gap-4">
            {sentRequests.map((user) => (
              <motion.li
                key={user.receiver._id}
                className="flex items-center justify-between px-6 py-4 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:bg-gray-100 transform hover:-translate-y-1"
                whileHover={{ scale: 1.02 }}
              >
                {/* User Info */}
                <Link href={`profile/${user.receiver._id}`} className="flex items-center">
                  <motion.img
                    src={user.receiver.profilePicture}
                    alt={user.receiver.fullName}
                    className="w-16 h-16 rounded-full border-2 border-blue-500 shadow-md mr-5 object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-700 text-lg">{user.receiver.fullName}</h3>
                    <p className="text-sm text-gray-500">@{user.receiver.username}</p>
                    <p className="text-xs text-gray-400 italic mt-1">{user.receiver.bio}</p>
                  </div>
                </Link>
                {/* Action Buttons */}
                <div className="flex flex-col space-y-1.5">
                  <button
                    onClick={() => handleCancelRequest(user._id)}
                    className="flex justify-center items-center px-4 py-2 text-sm font-medium bg-red-600 border border-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    <FiUserCheck className="mr-2 w-5 h-5" />
                    Cancel
                  </button>
                  <Link href={`profile/${user.receiver._id}`}>
                    <button className="flex justify-center items-center px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition duration-300">
                      <FiEye className="mr-2 w-5 h-5" />
                      View Profile
                    </button>
                  </Link>
                </div>
              </motion.li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-10">
            <FiUserCheck className="text-gray-300 text-6xl mb-4" />
            <p className="text-xl text-gray-500">No Sent Friend Requests</p>
            <p className="text-sm text-gray-400 mt-2">
              You haven't sent any friend requests yet. Start connecting with others to grow your network!
            </p>
          </div>
        )}
      </section>
    </AuthRedirect>
  );
};

export default SentRequests;

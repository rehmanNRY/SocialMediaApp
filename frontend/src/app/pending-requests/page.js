"use client"
import React, { useEffect } from 'react';
import {
  fetchReceivedRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} from '@/redux/friendRequests/friendRequestsSlice';
import { useDispatch, useSelector } from 'react-redux';
import AuthRedirect from '@/components/AuthRedirect';
import { FaUserCheck, FaUserTimes, FaUserCircle } from 'react-icons/fa';
import { IoMdEye } from 'react-icons/io';
import Link from 'next/link';

const PendingRequests = () => {
  const dispatch = useDispatch();
  const receivedRequests = useSelector((state) => state.friendRequests.receivedRequests);

  useEffect(() => {
    dispatch(fetchReceivedRequests());
  }, [dispatch]);

  const handleAcceptRequest = (requestId) => {
    dispatch(acceptFriendRequest(requestId));
  };

  const handleRejectRequest = (requestId) => {
    dispatch(rejectFriendRequest(requestId));
  };

  return (
    <AuthRedirect>
      <section className="pending-requests bg-[#F5F6FA] p-8 w-full h-full"
        style={{ minHeight: "calc(100vh - 4.5rem)" }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center space-x-3">
          <FaUserCircle className="text-blue-500" />
          <span>Pending Friend Requests</span>
        </h2>
        {receivedRequests.length > 0 ? (
          <ul className="grid grid-cols-1 gap-4">
            {receivedRequests.map((user) => (
              <li
                key={user.sender._id}
                className="flex items-center justify-between p-6 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition duration-300 hover:bg-gray-100 transform hover:-translate-y-1"
              >
                {/* User Info */}
                <Link href={`profile/${user.sender._id}`} className="flex items-center space-x-4 cursor-pointer">
                  <img
                    src={user.sender.profilePicture}
                    alt={user.sender.fullName}
                    className="w-16 h-16 rounded-full border-2 border-blue-400 shadow-sm object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-700 text-lg">{user.sender.fullName}</h3>
                    <p className="text-sm text-gray-500">@{user.sender.username}</p>
                    <p className="text-xs text-gray-400 italic mt-1">{user.sender.bio}</p>
                  </div>
                </Link>
                {/* Action Buttons */}
                <div className="flex space-y-2 flex-col">
                  <button
                    className="flex items-center px-2 py-1 text-base font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition duration-300 justify-center"
                    onClick={() => handleAcceptRequest(user._id)}
                    title="Accept Request"
                  >
                    <FaUserCheck className="mr-2" />
                    Accept
                  </button>
                  <button
                    className="flex items-center px-2 py-1 text-base font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-300 justify-center"
                    onClick={() => handleRejectRequest(user._id)}
                    title="Reject Request"
                  >
                    <FaUserTimes className="mr-2" />
                    Reject
                  </button>
                  <Link href={`profile/${user.sender._id}`}
                    className="cursor-pointer flex items-center px-2 py-1 text-base font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition duration-300 justify-center"
                    title="View Profile"
                  >
                    <IoMdEye className="mr-2" />
                    View Profile
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-10">
            <FaUserTimes className="text-gray-300 text-6xl mb-4" />
            <p className="text-xl text-gray-500">No Pending Friend Requests</p>
            <p className="text-sm text-gray-400 mt-2">
              You currently have no friend requests waiting for your approval. Connect with others to expand your network!
            </p>
          </div>
        )}
      </section>
    </AuthRedirect>
  );
};

export default PendingRequests;

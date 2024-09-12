"use client"
import React, {useEffect} from 'react';
import {
  fetchReceivedRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} from '@/redux/friendRequests/friendRequestsSlice';
import { useDispatch, useSelector } from 'react-redux';

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
    <section className="pending-requests bg-white p-6 rounded-xl shadow-md w-full h-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Pending Friend Requests</h2>
      {receivedRequests.length > 0 ? <ul className="grid grid-cols-1 gap-3">
        {receivedRequests.map((user) => (
          <li
            key={user.sender._id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-lg transition duration-200 w-full"
          >
            {/* User Info */}
            <div className="flex items-center">
              <img
                src={user.sender.profilePicture}
                alt={user.sender.fullName}
                className="w-14 h-14 rounded-full border-2 border-red-400 shadow-sm mr-4"
              />
              <div>
                <h3 className="font-medium text-gray-700">{user.sender.fullName}</h3>
                <p className="text-sm text-gray-500">{user.sender.username}</p>
                <p className="text-xs text-gray-400">{user.sender.bio}</p>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex flex-col space-y-2">
              <button className="px-3 py-1 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition duration-200"  onClick={() => handleAcceptRequest(user._id)}>
                Accept
              </button>
              <button className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-200" onClick={() => handleRejectRequest(user._id)}>
                Reject
              </button>
              <button className="px-3 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition duration-200">
                View Profile
              </button>
            </div>
          </li>
        ))}
      </ul> : <p className="text-lg text-gray-500">No pending friend requests</p>}
    </section>
  );
};

export default PendingRequests;

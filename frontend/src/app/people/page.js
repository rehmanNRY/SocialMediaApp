"use client"
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '@/redux/users/usersSlice';
import Link from 'next/link';
import {
  fetchSentRequests,
  fetchReceivedRequests,
  fetchFriendsList,
  sendFriendRequest,
  // acceptFriendRequest,
  // rejectFriendRequest,
} from '@/redux/friendRequests/friendRequestsSlice';

const FriendsSuggestion = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const sentRequests = useSelector((state) => state.friendRequests.sentRequests);
  const receivedRequests = useSelector((state) => state.friendRequests.receivedRequests);
  const friendsList = useSelector((state) => state.friendRequests.friendsList);

  const status = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }

    dispatch(fetchSentRequests());

    dispatch(fetchReceivedRequests());
    dispatch(fetchFriendsList());

  }, [status, dispatch]);

  useEffect(() => {
    console.log('Sent Requests:', sentRequests);
    console.log('rec Requests:', receivedRequests);
    console.log('frnd list: ',friendsList)
  }, [sentRequests, receivedRequests, friendsList]);

  if (status === 'loading') {
    return <p className="border border-blue-400 font-semibold text-blue-900 bg-blue-100 text-sm rounded-lg px-4 py-1 mx-6 mt-4">Fetching Users...</p>;
  }

  if (status === 'failed') {
    return <p className="border border-red-400 font-semibold text-red-900 bg-red-100 text-sm rounded-lg px-4 py-1 mx-6 mt-4">Error: {error}</p>;
  }


  // For frnd req




  const handleSendRequest = (receiverId) => {
    dispatch(sendFriendRequest(receiverId));
  };

  // const handleAcceptRequest = (requestId) => {
  //   dispatch(acceptFriendRequest(requestId));
  // };

  // const handleRejectRequest = (requestId) => {
  //   dispatch(rejectFriendRequest(requestId));
  // };
  return (
    <section className="friends-suggestion bg-white p-6 rounded-xl shadow-md w-full h-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">People You May Know</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {users.map((user) => (
          <li
            key={user._id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-lg transition duration-200 w-full"
          >
            {/* User Info */}
            <div className="flex items-center">
              <img
                src={user.profilePicture}
                alt={user.fullName}
                className="w-14 h-14 rounded-full border-2 border-blue-400 shadow-sm mr-4"
              />
              <div>
                <h3 className="font-medium text-gray-700">{user.fullName}</h3>
                <p className="text-sm text-gray-500">@{user.username}</p>
                <p className="text-xs text-gray-400">{user.bio.slice(0,15)}..</p>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex flex-col space-y-2">
              <Link href={`/${user._id}`} className="px-3 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition duration-200">
                View Profile
              </Link>
              <button className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200" onClick={() => handleSendRequest(user._id)}>
                Add Friend
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default FriendsSuggestion;

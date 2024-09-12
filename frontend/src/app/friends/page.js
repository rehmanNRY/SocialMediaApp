"use client";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchFriendsList,
  unfriend,
} from '@/redux/friendRequests/friendRequestsSlice';

const FriendsList = () => {
  const dispatch = useDispatch();
  const friends = useSelector((state) => state.friendRequests.friendsList);

  useEffect(() => {
    dispatch(fetchFriendsList());
  }, [dispatch]);

  // Handle Unfriend Action
  const handleUnfriend = (friendId) => {
    dispatch(unfriend(friendId));
  };

  return (
    <section className="friends-list bg-white p-6 rounded-xl shadow-md w-full h-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Friends List</h2>
      {friends.length > 0 ? <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {friends.map((friend) => (
          <li
            key={friend._id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-lg transition duration-200 w-full"
          >
            {/* Friend Info */}
            <div className="flex items-center">
              <img
                src={friend.profilePicture}
                alt={friend.fullName}
                className="w-14 h-14 rounded-full border-2 border-blue-400 shadow-sm mr-4"
              />
              <div>
                <h3 className="font-medium text-gray-700">{friend.fullName}</h3>
                <p className="text-sm text-gray-500">{friend.username}</p>
                <p className="text-xs text-gray-400">{friend.bio}</p>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => handleUnfriend(friend._id)}
                className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-200"
              >
                Remove Friend
              </button>
              <button className="px-3 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition duration-200">
                View Profile
              </button>
            </div>
          </li>
        ))}
      </ul> : <p>No friends to show</p>}
    </section>
  );
};

export default FriendsList;
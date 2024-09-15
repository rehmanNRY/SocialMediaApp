"use client";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchFriendsList,
  unfriend,
} from '@/redux/friendRequests/friendRequestsSlice';
import AuthRedirect from '@/components/AuthRedirect';

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
    <AuthRedirect>
      <section className="friends-list bg-[#F5F6FA] p-8 w-full h-full"
      style={{ minHeight: "calc(100vh - 4.5rem)" }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Friends List</h2>
        {friends.length > 0 ? (
          <ul className="grid grid-cols-1 gap-6">
            {friends.map((friend) => (
              <li
                key={friend._id}
                className="flex items-center justify-between p-6 bg-[#fff] rounded-lg shadow-md hover:shadow-lg transition duration-300 w-full"
              >
                {/* Friend Info */}
                <div className="flex items-center">
                  <img
                    src={friend.profilePicture}
                    alt={friend.fullName}
                    className="w-16 h-16 rounded-full border-2 border-blue-400 shadow-sm mr-5"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-700 text-lg">{friend.fullName}</h3>
                    <p className="text-sm text-gray-500">@{friend.username}</p>
                    <p className="text-xs text-gray-400">{friend.bio.slice(0, 50)}{friend.bio.length > 50 ? '...' : ''}</p>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => handleUnfriend(friend._id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    Remove Friend
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition duration-300">
                    View Profile
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-full text-center py-10">
            <p className="text-lg text-gray-500">No friends to show.</p>
            <p className="text-sm text-gray-400 mt-2">You have no friends added yet.</p>
          </div>
        )}
      </section>
    </AuthRedirect>
  );
};

export default FriendsList;

"use client";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchFriendsList,
  unfriend,
} from '@/redux/friendRequests/friendRequestsSlice';
import AuthRedirect from '@/components/AuthRedirect';
import { FaUserFriends } from 'react-icons/fa';
import Link from 'next/link';

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
      <section className="friends-list bg-[#F5F6FA] p-4 md:p-8 w-full h-full" style={{ minHeight: "calc(100vh - 4.5rem)" }}>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8">Friends List</h2>
        {friends.length > 0 ? (
          <ul className="grid grid-cols-1 gap-4">
            {friends.map((friend) => (
              <li
                key={friend._id}
                className="flex flex-col md:flex-row items-center md:justify-between px-4 md:px-6 py-4 bg-[#fff] rounded-lg shadow-md hover:shadow-lg transition duration-300 w-full"
              >
                {/* Friend Info */}
                <Link href={`profile/${friend._id}`} className="cursor-pointer flex items-center mb-4 md:mb-0 w-full md:w-auto">
                  <img
                    src={friend.profilePicture}
                    alt={friend.fullName}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-blue-400 shadow-sm mr-4 md:mr-5 object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-700 text-lg">{friend.fullName}</h3>
                    <p className="text-sm text-gray-500">@{friend.username}</p>
                    <p className="text-xs text-gray-400">{friend.bio}</p>
                  </div>
                </Link>
                {/* Action Buttons */}
                <div className="flex flex-row md:flex-col space-y-0 space-x-2 md:space-x-0 md:space-y-2 w-full md:w-auto">
                  <button
                    onClick={() => handleUnfriend(friend._id)}
                    className="w-full md:w-auto px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    Remove Friend
                  </button>
                  <Link href={`profile/${friend._id}`} className="w-full md:w-auto text-center px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition duration-300">
                    View Profile
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <FaUserFriends className="text-gray-300 text-5xl md:text-6xl mb-4" />
            <p className="text-lg md:text-xl text-gray-500">No friends to show</p>
            <p className="text-sm text-gray-400 mt-2">
              Add some friends to see them here.
            </p>
          </div>
        )}
      </section>

    </AuthRedirect>
  );
};

export default FriendsList;

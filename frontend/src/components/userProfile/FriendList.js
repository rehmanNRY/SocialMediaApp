import Link from 'next/link';
import React from 'react';
import { FaUserFriends } from 'react-icons/fa';

const FriendList = ({ users, user }) => {
  const friends = users.filter((friend) => user.friends.includes(friend._id));

  return (
    <div className="p-6 border-t border-gray-200 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Friends</h3>
        <FaUserFriends className="text-gray-600" />
      </div>
      {friends.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-6">
          <FaUserFriends className="text-gray-300 text-6xl mb-4" />
          <p className="text-xl text-gray-500">No friends to show</p>
          <p className="text-sm text-gray-400 mt-2">Add some friends to see them here.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 justify-center">
          {friends.map((friend) => (
            <Link
              key={friend._id}
              href={`profile/${friend._id}`}
              className="relative group flex flex-col items-center p-2 transition-transform transform hover:scale-105 cursor-pointer"
            >
              <img
                src={friend.profilePicture || "https://via.placeholder.com/80"}
                alt={friend.fullName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-gray-200"
              />
              <span className="text-sm sm:text-base text-gray-600 mt-2 text-center">
                {friend.fullName}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>

  );
};

export default FriendList;
import Link from 'next/link';
import React from 'react';
import { FaUserFriends } from 'react-icons/fa'; // Importing an icon for the message

const Following = ({ users, user }) => {
  const following = users.filter((friend) => user.following.includes(friend._id));

  return (
    <div className="p-6 border-t border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Following</h3>
      {following.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-10">
          <FaUserFriends className="text-gray-300 text-6xl mb-4" />
          <p className="text-xl text-gray-500">Not following anyone yet</p>
          <p className="text-sm text-gray-400 mt-2">Start following users to see them here.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
          {following.map((friend) => (
            <Link
              key={friend._id}
              className="flex flex-col items-center cursor-pointer"
              href={`profile/${friend._id}`}
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

export default Following;
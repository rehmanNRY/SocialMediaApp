import React from 'react';

const Following = ({ users, user }) => (
  <div className="p-6 border-t border-b border-gray-200">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Following</h3>
    <div className="flex space-x-4">
      {users.filter((friend) => user.following.includes(friend._id))
        .map((friend) => (
          <div key={friend._id} className="flex flex-col items-center">
            <img
              src={friend.profilePicture || "https://via.placeholder.com/80"}
              alt={friend.fullName}
              className="w-16 h-16 rounded-full border-2 border-gray-200"
            />
            <span className="text-sm text-gray-600 mt-2">{friend.fullName}</span>
          </div>
        ))}
    </div>
  </div>
);

export default Following;

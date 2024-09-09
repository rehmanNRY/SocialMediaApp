import React from 'react';

const FriendsList = () => {
  // Sample friends data
  const friends = [
    {
      name: 'Sophia Turner',
      username: '@sophiat',
      avatar: 'https://i.pravatar.cc/150?img=21',
      mutualFriends: 4,
    },
    {
      name: 'Liam Johnson',
      username: '@liamj',
      avatar: 'https://i.pravatar.cc/150?img=22',
      mutualFriends: 2,
    },
    {
      name: 'Olivia Brown',
      username: '@oliviab',
      avatar: 'https://i.pravatar.cc/150?img=23',
      mutualFriends: 3,
    },
    {
      name: 'Noah Davis',
      username: '@noahd',
      avatar: 'https://i.pravatar.cc/150?img=24',
      mutualFriends: 8,
    },
    {
      name: 'Emma Wilson',
      username: '@emmaw',
      avatar: 'https://i.pravatar.cc/150?img=25',
      mutualFriends: 6,
    },
    {
      name: 'James Smith',
      username: '@jamess',
      avatar: 'https://i.pravatar.cc/150?img=26',
      mutualFriends: 5,
    },
    {
      name: 'Mia Martinez',
      username: '@miam',
      avatar: 'https://i.pravatar.cc/150?img=27',
      mutualFriends: 7,
    },
    {
      name: 'Lucas Anderson',
      username: '@lucasa',
      avatar: 'https://i.pravatar.cc/150?img=28',
      mutualFriends: 9,
    },
  ];

  return (
    <section className="friends-list bg-white p-6 rounded-xl shadow-md w-full h-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Friends List</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {friends.map((friend, index) => (
          <li
            key={index}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-lg transition duration-200 w-full"
          >
            {/* Friend Info */}
            <div className="flex items-center">
              <img
                src={friend.avatar}
                alt={friend.name}
                className="w-14 h-14 rounded-full border-2 border-blue-400 shadow-sm mr-4"
              />
              <div>
                <h3 className="font-medium text-gray-700">{friend.name}</h3>
                <p className="text-sm text-gray-500">{friend.username}</p>
                <p className="text-xs text-gray-400">{friend.mutualFriends} mutual friends</p>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex flex-col space-y-2">
              <button className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-200">
                Remove Friend
              </button>
              <button className="px-3 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition duration-200">
                View Profile
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default FriendsList;

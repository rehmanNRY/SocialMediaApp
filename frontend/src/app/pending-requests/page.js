import React from 'react';

const PendingRequests = () => {
  // Sample pending request data
  const pendingRequests = [
    {
      name: 'Sophia Turner',
      username: '@sophiat',
      avatar: 'https://i.pravatar.cc/150?img=9',
      mutualFriends: 4,
    },
    {
      name: 'Liam Johnson',
      username: '@liamj',
      avatar: 'https://i.pravatar.cc/150?img=10',
      mutualFriends: 2,
    },
    {
      name: 'Olivia Brown',
      username: '@oliviab',
      avatar: 'https://i.pravatar.cc/150?img=11',
      mutualFriends: 3,
    },
    {
      name: 'Noah Davis',
      username: '@noahd',
      avatar: 'https://i.pravatar.cc/150?img=12',
      mutualFriends: 8,
    },
    {
      name: 'Emma Wilson',
      username: '@emmaw',
      avatar: 'https://i.pravatar.cc/150?img=13',
      mutualFriends: 6,
    },
    {
      name: 'James Smith',
      username: '@jamess',
      avatar: 'https://i.pravatar.cc/150?img=14',
      mutualFriends: 5,
    },
    {
      name: 'Mia Martinez',
      username: '@miam',
      avatar: 'https://i.pravatar.cc/150?img=15',
      mutualFriends: 7,
    },
    {
      name: 'Lucas Anderson',
      username: '@lucasa',
      avatar: 'https://i.pravatar.cc/150?img=16',
      mutualFriends: 9,
    },
  ];

  return (
    <section className="pending-requests bg-white p-6 rounded-xl shadow-md w-full h-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Pending Friend Requests</h2>
      <ul className="grid grid-cols-1 gap-3">
        {pendingRequests.map((user, index) => (
          <li
            key={index}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-lg transition duration-200 w-full"
          >
            {/* User Info */}
            <div className="flex items-center">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-14 h-14 rounded-full border-2 border-red-400 shadow-sm mr-4"
              />
              <div>
                <h3 className="font-medium text-gray-700">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.username}</p>
                <p className="text-xs text-gray-400">{user.mutualFriends} mutual friends</p>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex flex-col space-y-2">
              <button className="px-3 py-1 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition duration-200">
                Accept
              </button>
              <button className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-200">
                Reject
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

export default PendingRequests;

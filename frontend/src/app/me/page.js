import React from 'react';

const UserProfile = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Cover Photo */}
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
          <img
            src="https://via.placeholder.com/1200x300"
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Photo and Info */}
        <div className="relative p-6 flex items-center">
          <div className="absolute -top-16 left-6">
            <img
              src="https://via.placeholder.com/150"
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-md"
            />
          </div>
          <div className="ml-40">
            <h1 className="text-2xl font-bold text-gray-800">John Doe</h1>
            <p className="text-sm text-gray-600">Joined: January 2022</p>
            <p className="mt-2 text-gray-700">Full Stack Developer | Tech Enthusiast</p>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">
              Follow
            </button>
          </div>
        </div>

        {/* Profile Stats */}
        <div className="flex justify-around border-t border-b border-gray-200 py-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800">1.2k</h2>
            <p className="text-gray-600">Friends</p>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800">3.5k</h2>
            <p className="text-gray-600">Followers</p>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800">500</h2>
            <p className="text-gray-600">Following</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Information</h3>
          <ul className="space-y-2 text-gray-700">
            <li>
              <span className="font-semibold">Location:</span> New York, USA
            </li>
            <li>
              <span className="font-semibold">Email:</span> john.doe@example.com
            </li>
            <li>
              <span className="font-semibold">Website:</span> www.johndoe.com
            </li>
            <li>
              <span className="font-semibold">Skills:</span> JavaScript, React, Node.js, CSS, HTML
            </li>
            <li>
              <span className="font-semibold">Bio:</span> Passionate about building beautiful web applications and exploring new technologies.
            </li>
          </ul>
        </div>

        {/* Friends List */}
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Friends</h3>
          <div className="flex space-x-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <img
                  src="https://via.placeholder.com/80"
                  alt={`Friend ${index + 1}`}
                  className="w-16 h-16 rounded-full border-2 border-gray-200"
                />
                <span className="text-sm text-gray-600 mt-2">Friend {index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
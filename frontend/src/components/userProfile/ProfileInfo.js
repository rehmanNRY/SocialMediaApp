import React from 'react';
import { FiMapPin, FiMail, FiUser, FiCalendar, FiUserCheck } from 'react-icons/fi';
import { MdEdit } from 'react-icons/md';
import Link from 'next/link'; // Import Link from next/link

const ProfileInfo = ({ user }) => (
  <div className="p-6 bg-white rounded-lg">
    <h3 className="text-xl font-bold text-gray-800 flex items-center mt-3">
      <FiUserCheck className="text-indigo-500 w-6 h-6 mr-2 ml-2" />
      Profile Information
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 mt-5">
      <div className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded-md transition-colors duration-200 ease-in-out">
        <FiMapPin className="text-red-500 w-6 h-6" />
        <div>
          <span className="font-semibold text-gray-900">Location:</span>
          <div className="text-gray-600">{user.location || 'Not specified'}</div>
        </div>
      </div>
      <div className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded-md transition-colors duration-200 ease-in-out">
        <FiMail className="text-blue-500 w-6 h-6" />
        <div>
          <span className="font-semibold text-gray-900">Email:</span>
          <div className="text-gray-600">{user.email}</div>
        </div>
      </div>
      <div className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded-md transition-colors duration-200 ease-in-out">
        <FiUser className="text-green-500 w-6 h-6" />
        <div>
          <span className="font-semibold text-gray-900">Bio:</span>
          <div className="text-gray-600">{user.bio}</div>
        </div>
      </div>
      <div className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded-md transition-colors duration-200 ease-in-out">
        <FiCalendar className="text-yellow-500 w-6 h-6" />
        <div>
          <span className="font-semibold text-gray-900">Date of Birth:</span>
          <div className="text-gray-600">{user.dob ? new Date(user.dob).toLocaleDateString() : 'Not specified'}</div>
        </div>
      </div>
    </div>
  </div>
);

export default ProfileInfo;

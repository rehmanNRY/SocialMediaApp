import React from 'react';
import { FiMapPin, FiMail, FiUser } from 'react-icons/fi';

const ProfileInfo = ({ user }) => (
  <div className="p-6 bg-white rounded-lg">
    <h3 className="text-xl font-bold text-gray-800 mb-4">Profile Information</h3>
    <ul className="space-y-3 text-gray-700">
      <li className="flex items-center space-x-2">
        <FiMapPin className="text-gray-500" />
        <span className="font-semibold">Location: </span> New York, USA
      </li>
      <li className="flex items-center space-x-2">
        <FiMail className="text-gray-500" />
        <span className="font-semibold">Email: </span> {user.email}
      </li>
      <li className="flex items-center space-x-2">
        <FiUser className="text-gray-500" />
        <span className="font-semibold">Bio: </span> {user.bio}
      </li>
    </ul>
  </div>
);

export default ProfileInfo;

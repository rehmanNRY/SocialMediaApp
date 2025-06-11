import React from 'react';
import { RiDraftLine } from 'react-icons/ri';

const PostFormHeader = ({ userDetails, isDraftSaved = false }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img
            className="w-12 h-12 object-cover rounded-full shadow-md ring-2 ring-indigo-100 border border-white"
            src={userDetails?.profilePicture || 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg'}
            alt={userDetails?.fullName}
          />
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 text-base sm:text-lg">What's on your mind?</h4>
        </div>
      </div>

      {/* Draft indicator */}
      {isDraftSaved && (
        <div className="flex items-center text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded-md">
          <RiDraftLine className="w-3 h-3 mr-1" />
          Draft saved
        </div>
      )}
    </div>
  );
};

export default PostFormHeader; 
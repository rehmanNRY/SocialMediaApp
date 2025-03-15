import React from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const PostFormMood = ({ mood, setMood }) => {
  if (!mood) return null;
  
  return (
    <div className="mt-2 flex items-center space-x-2">
      <span className="text-sm text-gray-600">Feeling:</span>
      <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
        {mood}
        <button
          type="button"
          className="ml-1 text-gray-500 hover:text-gray-700"
          onClick={() => setMood('')}
        >
          <AiOutlineCloseCircle className="inline w-4 h-4" />
        </button>
      </span>
    </div>
  );
};

export default PostFormMood; 
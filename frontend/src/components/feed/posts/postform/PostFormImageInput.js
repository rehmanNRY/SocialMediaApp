import React from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const PostFormImageInput = ({ showImageInput, setShowImageInput, image, setImage }) => {
  if (!showImageInput) return null;
  
  return (
    <div className="mt-3 p-3 bg-gray-100 rounded-lg animate-slideIn">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium">Add a photo</span>
        <button
          type="button"
          onClick={() => setShowImageInput(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <AiOutlineCloseCircle className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white">
        <input
          type="text"
          placeholder="Or paste an image URL"
          className="mt-3 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </div>
    </div>
  );
};

export default PostFormImageInput; 
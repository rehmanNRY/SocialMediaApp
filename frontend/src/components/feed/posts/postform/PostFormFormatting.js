import React from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { MdFormatBold, MdFormatItalic, MdFormatUnderlined } from 'react-icons/md';

const PostFormFormatting = ({ showFormatting, setShowFormatting, handleFormat }) => {
  if (!showFormatting) return null;
  
  return (
    <div className="my-2 p-2 bg-gray-100 rounded-lg flex space-x-2 animate-slideIn">
      <button
        type="button"
        className="p-1.5 rounded hover:bg-gray-200 transition duration-200"
        onClick={() => handleFormat('bold')}
      >
        <MdFormatBold className="w-5 h-5 text-gray-700" />
      </button>
      <button
        type="button"
        className="p-1.5 rounded hover:bg-gray-200 transition duration-200"
        onClick={() => handleFormat('italic')}
      >
        <MdFormatItalic className="w-5 h-5 text-gray-700" />
      </button>
      <button
        type="button"
        className="p-1.5 rounded hover:bg-gray-200 transition duration-200"
        onClick={() => handleFormat('underline')}
      >
        <MdFormatUnderlined className="w-5 h-5 text-gray-700" />
      </button>
      <div className="flex-grow"></div>
      <button
        type="button"
        className="p-1.5 rounded hover:bg-gray-200 transition duration-200"
        onClick={() => setShowFormatting(false)}
      >
        <AiOutlineCloseCircle className="w-5 h-5 text-gray-500" />
      </button>
    </div>
  );
};

export default PostFormFormatting; 
import React from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { MdFormatBold, MdFormatItalic, MdFormatUnderlined, MdHelpOutline } from 'react-icons/md';

const PostFormFormatting = ({ showFormatting, setShowFormatting, handleFormat }) => {
  if (!showFormatting) return null;

  return (
    <div className='my-3 rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white transition-all duration-300 hover:shadow-md'>
      <div className="px-3 py-2 flex items-center space-x-3">
        <button
          type="button"
          className="p-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all duration-200 group relative"
          onClick={() => handleFormat('bold')}
          title="Bold"
        >
          <MdFormatBold className="w-5 h-5 text-gray-700 group-hover:text-blue-600" />
          <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-200"></span>
        </button>
        <button
          type="button"
          className="p-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all duration-200 group relative"
          onClick={() => handleFormat('italic')}
          title="Italic"
        >
          <MdFormatItalic className="w-5 h-5 text-gray-700 group-hover:text-blue-600" />
          <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-200"></span>
        </button>
        <button
          type="button"
          className="p-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all duration-200 group relative"
          onClick={() => handleFormat('underline')}
          title="Underline"
        >
          <MdFormatUnderlined className="w-5 h-5 text-gray-700 group-hover:text-blue-600" />
          <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-200"></span>
        </button>
        <div className="flex-grow"></div>
        <button
          type="button"
          className="p-2 rounded-full hover:bg-red-50 hover:text-red-500 active:scale-95 transition-all duration-200"
          onClick={() => setShowFormatting(false)}
          title="Close formatting"
        >
          <AiOutlineCloseCircle className="w-5 h-5 text-gray-500 hover:text-red-500" />
        </button>
      </div>
      {/* Quick tips - only show on basic tab */}
      <div className="px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100 text-xs font-medium text-indigo-700 flex items-center">
        <MdHelpOutline className="w-4 h-4 mr-2 text-blue-600 animate-pulse" />
        <span>Pro tip: Select text first, then apply formatting for best results</span>
      </div>
    </div>
  );
};

export default PostFormFormatting;
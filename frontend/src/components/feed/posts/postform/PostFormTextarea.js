import React from 'react';

const PostFormTextarea = ({ 
  content, 
  setContent, 
  charCount, 
  isExpanded, 
  backgroundColor, 
  textareaRef, 
  handleTextareaFocus, 
  userDetails,
  style
}) => {
  return (
    <div className={`relative`}>
      <textarea
        ref={textareaRef}
        className={`w-full p-3 sm:p-4 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300 shadow-sm placeholder:italic placeholder-gray-400 border border-gray-300 ${backgroundColor === 'bg-white' ? 'bg-[#F8F8F9]' : backgroundColor}`}
        style={style}
        rows={isExpanded ? "4" : "3"}
        placeholder={`What's on your mind, ${userDetails?.fullName || 'there'}?`}
        value={content}
        maxLength={100}
        onChange={(e) => setContent(e.target.value)}
        onFocus={handleTextareaFocus}
      />

      {/* Character count indicator */}
      <div className={`absolute bottom-3 right-3 text-xs ${charCount > 80 ? (charCount > 90 ? 'text-red-500' : 'text-yellow-500') : 'text-gray-400'}`}>
        {charCount}/100
      </div>
    </div>
  );
};

export default PostFormTextarea; 
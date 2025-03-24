import React, { useState, useEffect } from 'react';
import { formatText, hasFormatting } from "@/utility/textFormatter";
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

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
  const [showPreview, setShowPreview] = useState(false);

  // Check if content has formatting to show preview
  useEffect(() => {
    setShowPreview(hasFormatting(content));
  }, [content]);

  // Create formatted HTML from content
  const formattedContent = formatText(content);

  // Get character count color
  const getCharCountColor = () => {
    if (charCount > 90) return 'text-red-500';
    if (charCount > 80) return 'text-yellow-500';
    return 'text-gray-400';
  };

  return (
    <>
      <div className="relative">
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

      {/* Format Preview */}
      {hasFormatting(content) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="my-2"
        >
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium text-indigo-600">Formatted Preview</div>
            <button
              type='button'
              onClick={() => setShowPreview(!showPreview)}
              className="text-gray-500 hover:text-indigo-600 transition-colors duration-200 text-sm flex items-center gap-1"
            >
              {showPreview ? (
                <>
                  <FaEyeSlash size={14} />
                  <span>Hide</span>
                </>
              ) : (
                <>
                  <FaEye size={14} />
                  <span>Show</span>
                </>
              )}
            </button>
          </div>

          {showPreview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
            >
              <div
                className="text-gray-800 prose"
                dangerouslySetInnerHTML={{ __html: formattedContent }}
              />
            </motion.div>
          )}
        </motion.div>
      )}
    </>
  );
};

export default PostFormTextarea;
import React from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { GoLocation } from 'react-icons/go';

const PostFormAdvancedOptions = ({ showAdvancedOptions, setShowAdvancedOptions, handleMoodSelect }) => {
  if (!showAdvancedOptions) return null;
  
  // Mood options
  const moodOptions = [
    { emoji: '😊', text: 'Happy' },
    { emoji: '🤔', text: 'Thoughtful' },
    { emoji: '😴', text: 'Tired' },
    { emoji: '🎉', text: 'Celebrating' },
    { emoji: '💼', text: 'Working' },
    { emoji: '😎', text: 'Confident' }
  ];
  
  return (
    <div className="mt-3 p-3 bg-gray-100 rounded-lg shadow-sm animate-slideIn">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium">How are you feeling?</span>
        <button
          type="button"
          onClick={() => setShowAdvancedOptions(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <AiOutlineCloseCircle className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {moodOptions.map((option) => (
          <button
            key={option.text}
            type="button"
            className="flex items-center space-x-1 bg-white hover:bg-gray-50 px-2 py-1 rounded-full text-gray-700 text-sm border border-gray-200 transition duration-200"
            onClick={() => handleMoodSelect(`${option.emoji} Feeling ${option.text}`)}
          >
            <span>{option.emoji}</span>
            <span>{option.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PostFormAdvancedOptions; 
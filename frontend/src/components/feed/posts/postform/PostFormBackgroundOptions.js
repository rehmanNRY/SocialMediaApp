import React from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const PostFormBackgroundOptions = ({ 
  showBackgroundOptions, 
  setShowBackgroundOptions, 
  backgroundColor, 
  setBackgroundColor 
}) => {
  if (!showBackgroundOptions) return null;
  
  const backgroundColors = [
    { name: 'White', class: 'bg-white' },
    { name: 'Light Blue', class: 'bg-blue-50' },
    { name: 'Light Purple', class: 'bg-purple-50' },
    { name: 'Light Green', class: 'bg-green-50' },
    { name: 'Light Yellow', class: 'bg-yellow-50' },
    { name: 'Light Pink', class: 'bg-pink-50' }
  ];
  
  return (
    <div className="mt-3 p-3 bg-gray-100 rounded-lg animate-slideIn">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Background color</span>
        <button
          type="button"
          onClick={() => setShowBackgroundOptions(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <AiOutlineCloseCircle className="w-5 h-5" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {backgroundColors.map((color) => (
          <button
            key={color.class}
            type="button"
            className={`w-8 h-8 rounded-full border ${backgroundColor === color.class ? 'ring-2 ring-indigo-500' : 'ring-1 ring-gray-300'} ${color.class}`}
            onClick={() => {
              setBackgroundColor(color.class);
              setShowBackgroundOptions(false);
            }}
            title={color.name}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default PostFormBackgroundOptions; 
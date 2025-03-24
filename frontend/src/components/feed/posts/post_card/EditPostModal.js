import { useState } from "react";

// Edit Post Modal Component
const EditPostModal = ({ isOpen, onClose, post, onSave }) => {
  const [editContent, setEditContent] = useState(post.content);
  const [editBackgroundColor, setEditBackgroundColor] = useState(post.backgroundColor || 'bg-white');

  const handleSave = () => {
    onSave(editContent, editBackgroundColor);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Edit Post</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              maxLength={1000}
              rows={6}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="What's on your mind?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
            <select
              value={editBackgroundColor}
              onChange={(e) => setEditBackgroundColor(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="bg-white">White</option>
              <option value="bg-blue-50">Light Blue</option>
              <option value="bg-purple-50">Light Purple</option>
              <option value="bg-green-50">Light Green</option>
              <option value="bg-yellow-50">Light Yellow</option>
              <option value="bg-pink-50">Light Pink</option>
              <option value="pattern-dots bg-white">Pattern: Dots</option>
              <option value="pattern-grid bg-white">Pattern: Grid</option>
              <option value="pattern-stars bg-white">Pattern: Stars</option>
              <option value="pattern-waves bg-white">Pattern: Waves</option>
              <option value="pattern-hearts bg-white">Pattern: Hearts</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;
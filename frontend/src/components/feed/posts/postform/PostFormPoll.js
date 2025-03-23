import React, { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaTrash, FaGripLines } from 'react-icons/fa';

const PostFormPoll = ({
  showPollOptions,
  setShowPollOptions,
  pollOptions,
  setPollOptions,
  pollDuration,
  setPollDuration,
  handleAddPollOption,
  handleRemovePollOption,
  handlePollOptionChange,
  handleSavePoll,
  isPollSaved,
  setIsPollSaved,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [animatedEntrance, setAnimatedEntrance] = useState(true);

  // Handle drag start
  const handleDragStart = (index) => {
    setIsDragging(true);
    setDraggedIndex(index);
  };

  // Handle drag over
  const handleDragOver = (index) => {
    if (draggedIndex === null) return;
    if (draggedIndex === index) return;

    const newOptions = [...pollOptions];
    const draggedOption = newOptions[draggedIndex];

    // Remove the dragged item
    newOptions.splice(draggedIndex, 1);
    // Insert it at the new position
    newOptions.splice(index, 0, draggedOption);

    setPollOptions(newOptions);
    setDraggedIndex(index);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedIndex(null);
  };

  // Handle entrance animation
  useEffect(() => {
    if (showPollOptions) {
      setAnimatedEntrance(true);
      const timer = setTimeout(() => {
        setAnimatedEntrance(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showPollOptions]);

  if (!showPollOptions) return null;

  // Poll preview component
  const PollPreview = () => {
    return (
      <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-white">
        <h3 className="font-medium mb-3">Preview</h3>
        <div className="space-y-2">
          {pollOptions.map((option, index) => {
            const percentage = Math.floor(Math.random() * 50) + 10; // Random for preview
            return (
              <div key={index} className="poll-option">
                <div className="flex justify-between mb-1">
                  <span>{option || `Option ${index + 1}`}</span>
                  <span className="text-sm text-gray-500">{percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: '#EC4899'
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (isPollSaved) {
    return (
      <div className="mt-3 p-4 bg-gray-100 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <span className="font-medium text-lg">Poll Preview</span>
            <div className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Saved</div>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowPollOptions(false);
              setIsPollSaved(false);
            }}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Show the poll preview here - similar to your PollPreview component */}
        <div className="space-y-2">
          {pollOptions.map((option, index) => (
            option.trim() && (
              <div key={index} className="poll-option">
                <div className="flex justify-between mb-1">
                  <span>{option}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full"
                    style={{
                      width: "0%",
                      backgroundColor: "#6366F1"
                    }}
                  ></div>
                </div>
              </div>
            )
          ))}
        </div>

        <div className="mt-3 text-sm text-gray-600">
          Poll duration: {pollDuration === 1 ? '1 hour' :
            pollDuration === 24 ? '1 day' :
              `${pollDuration} hours`}
        </div>

        <div className="mt-4 flex">
          <button
            type="button"
            onClick={() => setIsPollSaved(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-2"
          >
            Edit poll
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`mt-3 p-4 bg-gray-100 rounded-lg shadow-md ${animatedEntrance ? 'animate-fadeIn' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <span className="font-medium text-lg">Create a poll</span>
          <div className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">New!</div>
        </div>
        <button
          type="button"
          onClick={() => setShowPollOptions(false)}
          className="text-gray-500 hover:text-gray-700 transition-colors p-1"
        >
          <FaTimes className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2.5">
          {pollOptions.map((option, index) => (
            <div
              key={index}
              className={`flex items-center px-3 py-1.5 bg-white rounded-lg shadow-sm border border-gray-200 ${isDragging && draggedIndex === index ? 'border-2 border-blue-500' : ''}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={() => handleDragOver(index)}
              onDragEnd={handleDragEnd}
            >
              <div className="mr-2 cursor-move text-gray-400">
                <FaGripLines className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={option}
                onChange={(e) => handlePollOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="flex-grow p-2 border-0 focus:ring-0 focus:outline-none"
              />
              {index >= 2 && (
                <button
                  type="button"
                  onClick={() => handleRemovePollOption(index)}
                  className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <FaTrash className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}

          {pollOptions.length < 6 && (
            <button
              type="button"
              onClick={handleAddPollOption}
              className="w-full p-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-indigo-600 hover:border-indigo-400 flex items-center justify-center transition-colors bg-white"
            >
              <FaPlus className="h-5 w-5 mr-1" />
              Add option
            </button>
          )}

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Poll settings</label>

            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Duration</label>
                <select
                  value={pollDuration}
                  onChange={(e) => setPollDuration(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                >
                  <option value={1}>1 hour</option>
                  <option value={6}>6 hours</option>
                  <option value={12}>12 hours</option>
                  <option value={24}>1 day</option>
                  <option value={48}>2 days</option>
                  <option value={72}>3 days</option>
                  <option value={168}>1 week</option>
                  <option value={336}>2 weeks</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Poll preview</span>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              {showPreview ? 'Hide preview' : 'Show preview'}
            </button>
          </div>

          {showPreview && <PollPreview />}

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Poll tips</h3>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Keep options clear and concise</li>
              <li>• Reorder options by dragging them</li>
              <li>• Choose a duration that fits your audience's activity</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => setShowPollOptions(false)}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={pollOptions.filter(opt => opt.trim()).length < 2} // Corrected the condition to disable the button
          onClick={handleSavePoll} // Use the prop function here
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-500"
        >
          Save poll
        </button>
      </div>
    </div>
  );
};

export default PostFormPoll;
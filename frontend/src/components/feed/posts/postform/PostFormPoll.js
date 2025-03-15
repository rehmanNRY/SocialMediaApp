import React from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const PostFormPoll = ({ 
  showPollOptions, 
  setShowPollOptions, 
  pollOptions, 
  setPollOptions, 
  pollDuration, 
  setPollDuration,
  handleAddPollOption,
  handleRemovePollOption,
  handlePollOptionChange
}) => {
  if (!showPollOptions) return null;
  
  return (
    <div className="mt-3 p-3 bg-gray-100 rounded-lg shadow-sm animate-slideIn">
      <div className="flex justify-between items-center mb-3">
        <span className="font-medium">Create a poll</span>
        <button
          type="button"
          onClick={() => setShowPollOptions(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <AiOutlineCloseCircle className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2">
        {pollOptions.map((option, index) => (
          <div key={index} className="flex items-center">
            <input
              type="text"
              value={option}
              onChange={(e) => handlePollOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {index >= 2 && (
              <button
                type="button"
                onClick={() => handleRemovePollOption(index)}
                className="ml-2 text-gray-500 hover:text-red-500"
              >
                <AiOutlineCloseCircle className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}

        {pollOptions.length < 4 && (
          <button
            type="button"
            onClick={handleAddPollOption}
            className="text-sm text-indigo-600 hover:text-indigo-700 mt-2"
          >
            + Add another option
          </button>
        )}

        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Poll duration</label>
          <select
            value={pollDuration}
            onChange={(e) => setPollDuration(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value={1}>1 hour</option>
            <option value={6}>6 hours</option>
            <option value={12}>12 hours</option>
            <option value={24}>1 day</option>
            <option value={48}>2 days</option>
            <option value={168}>1 week</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PostFormPoll; 
import React from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const PostFormHashtags = ({ showHashtags, setShowHashtags, handleHashtagClick }) => {
  if (!showHashtags) return null;
  
  // Popular hashtags with categories
  const hashtagCategories = {
    Trending: ['#trending', '#viral', '#todaystrends', '#popular'],
    Tech: ['#dev', '#coding', '#javascript', '#reactjs', '#tech'],
    Lifestyle: ['#nature', '#travel', '#food', '#fitness'],
    Social: ['#love', '#blessed', '#friends', '#family', '#weekend']
  };
  
  return (
    <div className="mt-3 p-3 bg-gray-100 rounded-lg shadow-sm animate-slideIn">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium">Popular hashtags</span>
        <button
          type="button"
          onClick={() => setShowHashtags(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <AiOutlineCloseCircle className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        {Object.entries(hashtagCategories).map(([category, tags]) => (
          <div key={category}>
            <h4 className="text-xs text-gray-500 mb-1">{category}</h4>
            <div className="flex flex-wrap gap-2">
              {tags.map((hashtag) => (
                <button
                  key={hashtag}
                  type="button"
                  className="bg-indigo-500 text-white text-xs px-2.5 py-1.5 rounded-full shadow-sm hover:bg-indigo-600 transition duration-200"
                  onClick={() => handleHashtagClick(hashtag)}
                >
                  {hashtag}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostFormHashtags; 
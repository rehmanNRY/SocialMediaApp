import React from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const PostFormEmojis = ({ showEmojis, setShowEmojis, handleEmojiClick }) => {
  if (!showEmojis) return null;
  
  // Enhanced emoji categories
  const emojiCategories = {
    Smileys: ['😊', '😂', '😍', '🥰', '😎', '🤔', '😢', '😡'],
    Animals: ['🐶', '🐱', '🦁', '🐼', '🦊', '🐢', '🦄', '🐬'],
    Objects: ['💻', '📱', '🚗', '✈️', '🏠', '📸', '🎮', '💡'],
    Symbols: ['❤️', '💯', '⭐', '🔥', '✅', '❌', '💬', '👍']
  };
  
  return (
    <div className="mt-3 p-3 bg-gray-100 rounded-lg shadow-sm animate-slideIn">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium">Emojis</span>
        <button
          type="button"
          onClick={() => setShowEmojis(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <AiOutlineCloseCircle className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        {Object.entries(emojiCategories).map(([category, emojis]) => (
          <div key={category}>
            <h4 className="text-xs text-gray-500 mb-1">{category}</h4>
            <div className="flex flex-wrap gap-2">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className="text-xl bg-white hover:bg-gray-50 p-1.5 rounded-lg transition duration-200"
                  onClick={() => handleEmojiClick(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostFormEmojis; 
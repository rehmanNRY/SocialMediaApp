import React, { useState } from 'react';
import {
  AiOutlineCloseCircle,
  AiOutlineSmile,
  AiOutlineStar,
  AiOutlineHeart,
  AiOutlineCar,
  AiOutlineSearch,
  AiOutlineLeft,
  AiOutlineRight
} from 'react-icons/ai';
import { FaDog, FaRegLaughBeam } from 'react-icons/fa';

const PostFormEmojis = ({ showEmojis, setShowEmojis, handleEmojiClick }) => {
  const [activeCategory, setActiveCategory] = useState('Smileys');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentEmojis, setRecentEmojis] = useState([]);

  // Enhanced emoji categories with more emojis
  const emojiCategories = {
    Smileys: ['😊', '😂', '😍', '🥰', '😎', '🤔', '😢', '😡', '🥳', '😴', '🤩', '😇', '🙄', '😬', '😱', '🤗'],
    Animals: ['🐶', '🐱', '🦁', '🐼', '🦊', '🐢', '🦄', '🐬', '🦜', '🐘', '🦒', '🐙', '🦋', '🐝', '🦔', '🦦'],
    Objects: ['💻', '📱', '🚗', '✈️', '🏠', '📸', '🎮', '💡', '⌚', '📦', '🎁', '🛒', '🔮', '🧸', '📚', '🎨'],
    Symbols: ['❤️', '💯', '⭐', '🔥', '✅', '❌', '💬', '👍', '🏆', '💪', '🎯', '💫', '💭', '🎵', '💲', '🚫'],
    Food: ['🍕', '🍔', '🍦', '🍫', '🍎', '🥑', '🍜', '🍷', '🍰', '🍩', '🌮', '🍣', '☕', '🥤', '🍓', '🥞'],
    Activities: ['⚽', '🏀', '🎮', '🎬', '🏄', '🧘', '🎭', '🎨', '🎯', '🎧', '🚴', '🏕️', '🎪', '🎤', '🎻', '🧩']
  };

  const categoryIcons = {
    Smileys: <FaRegLaughBeam />,
    Animals: <FaDog />,
    Objects: <AiOutlineCar />,
    Symbols: <AiOutlineHeart />,
    Food: '🍔',
    Activities: '⚽'
  };

  // Handle emoji selection and add to recent
  const onEmojiClick = (emoji) => {
    handleEmojiClick(emoji);
    if (!recentEmojis.includes(emoji)) {
      setRecentEmojis([emoji, ...recentEmojis.slice(0, 7)]);
    }
  };

  // Filter emojis based on search
  const filteredEmojis = searchQuery
    ? Object.values(emojiCategories).flat().filter(emoji => emoji.includes(searchQuery))
    : emojiCategories[activeCategory];

  if (!showEmojis) return null;

  return (
    <div className="p-4 bg-white rounded-xl shadow-md animate-fadeIn border border-gray-200 max-w-md mt-2.5">
      {/* Header with search */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">Emoji Picker</h3>
        <button
          type="button"
          onClick={() => setShowEmojis(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close emoji picker"
        >
          <AiOutlineCloseCircle className="w-6 h-6" />
        </button>
      </div>

      {/* Search bar */}
      <div className="relative mb-3">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <AiOutlineSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          placeholder="Search emojis..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Recent emojis row */}
      {recentEmojis.length > 0 && !searchQuery && (
        <div className="mb-3">
          <h4 className="text-xs font-medium text-gray-500 mb-1">Recent</h4>
          <div className="flex flex-wrap gap-1">
            {recentEmojis.map((emoji, index) => (
              <button
                key={`recent-${index}`}
                type="button"
                className="text-xl hover:bg-gray-100 p-2 rounded-lg transition-colors"
                onClick={() => onEmojiClick(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category tabs */}
      {!searchQuery && (
        <div className="flex overflow-x-auto scrollbar-hide mb-3 pb-1">
          <div className="flex space-x-1">
            {Object.keys(emojiCategories).map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`p-2 rounded-lg flex items-center justify-center min-w-[48px] transition-colors ${activeCategory === category
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-500 hover:bg-gray-100'
                  }`}
              >
                <span className="text-lg">{categoryIcons[category]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Emoji grid */}
      <div className="relative">
        <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto p-1">
          {(searchQuery ? filteredEmojis : emojiCategories[activeCategory]).map((emoji, index) => (
            <button
              key={`${activeCategory}-${index}`}
              type="button"
              className="text-xl hover:bg-gray-100 p-2 rounded-lg transition-colors transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-300"
              onClick={() => onEmojiClick(emoji)}
            >
              {emoji}
            </button>
          ))}
          {searchQuery && filteredEmojis.length === 0 && (
            <div className="col-span-8 py-8 text-center text-gray-500">
              No emojis found for "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      {/* Category title */}
      {!searchQuery && (
        <div className="mt-2 text-center relative">
          <div className="absolute bottom-0 left-2 z-10">
            <button
              className="p-1 rounded-full bg-white shadow-md text-gray-500 hover:text-gray-800 transition-colors"
              type="button"
              onClick={() => {
                const categories = Object.keys(emojiCategories);
                const currentIndex = categories.indexOf(activeCategory);
                const prevIndex = (currentIndex - 1 + categories.length) % categories.length;
                setActiveCategory(categories[prevIndex]);
              }}
            >
              <AiOutlineLeft className="w-4 h-4" />
            </button>
          </div>
          <span className="text-xs font-medium text-gray-500">{activeCategory}</span>
          <div className="absolute bottom-0 right-2 z-10">
            <button
              className="p-1 rounded-full bg-white shadow-md text-gray-500 hover:text-gray-800 transition-colors"
              type="button"
              onClick={() => {
                const categories = Object.keys(emojiCategories);
                const currentIndex = categories.indexOf(activeCategory);
                const nextIndex = (currentIndex + 1) % categories.length;
                setActiveCategory(categories[nextIndex]);
              }}
            >
              <AiOutlineRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      )}
    </div>
  );
};

export default PostFormEmojis;
import React, { useState, useEffect, useRef } from 'react';
import { 
  AiOutlineCloseCircle, 
  AiOutlineSearch, 
  AiOutlineFire, 
  AiOutlineStar,
  AiOutlinePlus,
  AiOutlineHistory,
  AiOutlineRise,
  AiOutlineGlobal
} from 'react-icons/ai';
import { FiTrendingUp, FiCode, FiCoffee, FiUsers, FiHash } from 'react-icons/fi';

const PostFormHashtags = ({ showHashtags, setShowHashtags, handleHashtagClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Trending');
  const [recentHashtags, setRecentHashtags] = useState([]);
  const [animateHashtag, setAnimateHashtag] = useState(null);
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);
  
  // Popular hashtags with categories
  const hashtagCategories = {
    Trending: ['#trending', '#viral', '#todaystrends', '#popular', '#dailytop', '#mustfollow', '#explore'],
    Tech: ['#dev', '#coding', '#javascript', '#reactjs', '#tech', '#webdev', '#frontend', '#ai', '#github'],
    Lifestyle: ['#nature', '#travel', '#food', '#fitness', '#wellness', '#photography', '#adventure', '#mindfulness'],
    Social: ['#love', '#blessed', '#friends', '#family', '#weekend', '#community', '#network', '#connection']
  };

  // Category icons mapping
  const categoryIcons = {
    Trending: <FiTrendingUp className="w-4 h-4" />,
    Tech: <FiCode className="w-4 h-4" />,
    Lifestyle: <FiCoffee className="w-4 h-4" />,
    Social: <FiUsers className="w-4 h-4" />
  };

  // Load recent hashtags from localStorage on component mount
  useEffect(() => {
    const savedHashtags = localStorage.getItem('recentHashtags');
    if (savedHashtags) {
      setRecentHashtags(JSON.parse(savedHashtags));
    }
    
    // Auto-focus search input when panel opens
    if (showHashtags && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 300);
    }
  }, [showHashtags]);

  // Save recent hashtags to localStorage when they change
  useEffect(() => {
    localStorage.setItem('recentHashtags', JSON.stringify(recentHashtags));
  }, [recentHashtags]);

  // Close the hashtag panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowHashtags(false);
      }
    };

    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setShowHashtags(false);
      }
    };

    if (showHashtags) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showHashtags, setShowHashtags]);

  if (!showHashtags) return null;

  // Handle hashtag selection and track in recent
  const handleHashtagSelection = (hashtag) => {
    // Set the animation for this hashtag
    setAnimateHashtag(hashtag);
    
    // After animation completes, reset and perform action
    setTimeout(() => {
      setAnimateHashtag(null);
      handleHashtagClick(hashtag);
      
      // Add to recent hashtags if not already there
      if (!recentHashtags.includes(hashtag)) {
        const updatedRecent = [hashtag, ...recentHashtags.slice(0, 4)];
        setRecentHashtags(updatedRecent);
      }
    }, 300);
  };

  // Handle custom hashtag creation
  const handleCreateCustomHashtag = () => {
    if (searchTerm && !searchTerm.startsWith('#')) {
      const newHashtag = `#${searchTerm.toLowerCase().replace(/\s+/g, '')}`;
      handleHashtagSelection(newHashtag);
      setSearchTerm('');
    }
  };

  // Filter hashtags based on search term
  const filteredHashtags = searchTerm 
    ? Object.fromEntries(
        Object.entries(hashtagCategories).map(([category, tags]) => [
          category, 
          tags.filter(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        ])
      )
    : hashtagCategories;

  // Get all hashtags for search
  const allHashtags = Object.values(hashtagCategories).flat();

  // Check if we have any results for the search
  const hasSearchResults = Object.values(filteredHashtags).some(tags => tags.length > 0);

  // Get random suggestions based on current search
  const getSuggestions = () => {
    if (!searchTerm) return [];
    
    return allHashtags
      .filter(tag => !tag.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
  };

  return (
    <div 
      ref={containerRef}
      className="mt-3 p-5 bg-white rounded-xl shadow-lg border border-gray-200 max-w-md"
      style={{
        animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 10px 25px -5px rgba(249, 168, 212, 0.1), 0 8px 10px -6px rgba(249, 168, 212, 0.1)'
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold text-lg flex items-center gap-2">
          <FiHash className="text-rose-500 text-xl" />
          <span className="bg-gradient-to-r from-rose-500 to-pink-600 text-transparent bg-clip-text">
            Discover Hashtags
          </span>
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowHashtags(false)}
            className="text-gray-500 hover:text-rose-500 transition-colors p-1.5 rounded-full hover:bg-rose-50"
            aria-label="Close hashtags panel"
          >
            <AiOutlineCloseCircle className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative mb-4 group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <AiOutlineSearch className="text-gray-400 w-5 h-5" />
        </div>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search or create hashtags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchTerm) {
              e.preventDefault();
              handleCreateCustomHashtag();
            }
          }}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-rose-500 shadow-sm transition-all duration-200 group-hover:border-rose-300"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-rose-500"
          >
            <AiOutlineCloseCircle className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Category tabs */}
      {!searchTerm && (
        <div className="flex mb-4 border-b overflow-x-auto hide-scrollbar">
          {Object.keys(hashtagCategories).map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              type='button'
              className={`px-4 py-2.5 flex items-center gap-2 font-medium text-sm whitespace-nowrap border-b-2 transition-all duration-200 ${
                activeCategory === category 
                  ? 'border-rose-500 text-rose-700 bg-rose-50 translate-y-0.5' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {categoryIcons[category]}
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Recent hashtags */}
      {recentHashtags.length > 0 && !searchTerm && (
        <div className="mb-4">
          <h4 className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1.5">
            <AiOutlineHistory className="w-4 h-4 text-gray-500" /> Recently Used
          </h4>
          <div className="flex flex-wrap gap-2">
            {recentHashtags.map((hashtag) => (
              <button
                key={`recent-${hashtag}`}
                type="button"
                className={`bg-rose-100 text-rose-700 text-xs px-3 py-1.5 rounded-full shadow-sm transition-all duration-200 hover:shadow-md hover:bg-rose-200 ${
                  animateHashtag === hashtag ? 'scale-110 bg-rose-300' : ''
                }`}
                onClick={() => handleHashtagSelection(hashtag)}
              >
                {hashtag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hashtag categories and tags */}
      <div className="space-y-4 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
        {searchTerm && !hasSearchResults && (
          <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
            <div className="flex flex-col items-center">
              <AiOutlineSearch className="w-8 h-8 mb-2 text-gray-400" />
              <p>No hashtags found matching "{searchTerm}"</p>
              <button 
                className="mt-3 text-rose-500 font-medium flex items-center gap-1.5 hover:text-rose-600 transition-colors"
                onClick={handleCreateCustomHashtag}
              >
                <AiOutlinePlus className="w-4 h-4" />
                Create #{searchTerm.toLowerCase().replace(/\s+/g, '')}
              </button>
            </div>
          </div>
        )}

        {searchTerm ? (
          // Display all categories that have matching results
          Object.entries(filteredHashtags).map(([category, tags]) => 
            tags.length > 0 && (
              <div key={category} className="bg-gray-50 p-3 rounded-lg transition-all duration-200 hover:shadow-sm">
                <h4 className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1.5">
                  {categoryIcons[category]} {category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map((hashtag) => (
                    <button
                      key={hashtag}
                      type="button"
                      className={`bg-rose-500 hover:bg-rose-600 text-white text-xs px-3 py-1.5 rounded-full shadow-sm transition-all duration-200 flex items-center hover:shadow-md ${
                        animateHashtag === hashtag ? 'scale-110 bg-rose-600' : ''
                      }`}
                      onClick={() => handleHashtagSelection(hashtag)}
                    >
                      {hashtag}
                    </button>
                  ))}
                </div>
              </div>
            )
          )
        ) : (
          // Display only the active category
          <div className="bg-gray-50 p-3 rounded-lg transition-all duration-200 hover:shadow-sm">
            <div className="flex flex-wrap gap-2">
              {hashtagCategories[activeCategory].map((hashtag) => (
                <button
                  key={hashtag}
                  type="button"
                  className={`bg-rose-500 hover:bg-rose-600 text-white text-xs px-3 py-1.5 rounded-full shadow-sm transition-all duration-200 transform hover:scale-105 active:scale-95 hover:shadow-md ${
                    animateHashtag === hashtag ? 'scale-110 bg-rose-600' : ''
                  }`}
                  onClick={() => handleHashtagSelection(hashtag)}
                >
                  {hashtag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Suggestions section */}
      {searchTerm && getSuggestions().length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <h4 className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1.5">
            <AiOutlineGlobal className="text-amber-500" /> Related hashtags you might like:
          </h4>
          <div className="flex flex-wrap gap-2">
            {getSuggestions().map(tag => (
              <button
                key={`suggestion-${tag}`}
                type="button"
                className={`bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full hover:bg-gray-200 transition-all duration-200 hover:shadow-sm hover:translate-y-px ${
                  animateHashtag === tag ? 'scale-110 bg-gray-300' : ''
                }`}
                onClick={() => handleHashtagSelection(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add custom hashtag button */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <button
          type="button"
          className={`w-full py-2.5 px-4 text-sm border ${
            searchTerm && !searchTerm.startsWith('#')
              ? 'border-rose-300 bg-rose-50 hover:bg-rose-100'
              : 'border-dashed border-gray-300 hover:border-rose-300 hover:bg-rose-50'
          } rounded-lg transition-all duration-200 hover:shadow-sm flex items-center justify-center gap-2 group`}
          onClick={handleCreateCustomHashtag}
        >
          {searchTerm && !searchTerm.startsWith('#') ? (
            <>
              <AiOutlinePlus className="text-rose-500" />
              <span>Create <span className="font-medium text-rose-600">#{searchTerm.toLowerCase().replace(/\s+/g, '')}</span></span>
            </>
          ) : (
            <>
              <span>Type to create custom hashtag</span>
              <AiOutlinePlus className="text-rose-500 group-hover:rotate-90 transition-transform duration-300" />
            </>
          )}
        </button>
      </div>

      {/* Keyboard shortcuts tip */}
      <div className="mt-4 pt-3 border-t border-gray-200 text-center text-xs text-gray-500">
        <p>Press <kbd className="bg-gray-100 px-1 py-0.5 rounded border border-gray-300 mx-1">Enter</kbd> to create custom hashtag • <kbd className="bg-gray-100 px-1 py-0.5 rounded border border-gray-300 mx-1">Esc</kbd> to close</p>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulseScale {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .animate-pulse-scale {
          animation: pulseScale 0.3s ease-in-out;
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #fda4af;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #fb7185;
        }
      `}</style>
    </div>
  );
};

export default PostFormHashtags;
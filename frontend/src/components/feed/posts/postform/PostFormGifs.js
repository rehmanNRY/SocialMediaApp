import React, { useState, useEffect, useRef } from 'react';
import {
  AiOutlineCloseCircle,
  AiOutlineSearch,
  AiOutlineLoading3Quarters,
  AiOutlineStar,
  AiOutlineHistory,
  AiOutlineFire,
  AiOutlineSmile,
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineLink,
  AiOutlineSend
} from 'react-icons/ai';

const PostFormGifs = ({ showGifSelector, setShowGifSelector, handleGifSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('trending');
  const [isSearching, setIsSearching] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [recentlyUsed, setRecentlyUsed] = useState([]);
  const searchInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('browse');
  const [copySuccess, setCopySuccess] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const containerRef = useRef(null);

  // Simulated categories
  const categories = [
    { id: 'trending', name: 'Trending', icon: <AiOutlineFire className="w-4 h-4" /> },
    { id: 'reactions', name: 'Reactions', icon: <AiOutlineSmile className="w-4 h-4" /> },
    { id: 'love', name: 'Love', icon: <AiOutlineHeart className="w-4 h-4" /> },
    { id: 'funny', name: 'Funny', icon: <AiOutlineSmile className="w-4 h-4" /> },
    { id: 'animals', name: 'Animals', icon: <AiOutlineSmile className="w-4 h-4" /> },
    { id: 'sports', name: 'Sports', icon: <AiOutlineSmile className="w-4 h-4" /> },
  ];

  // Extended list of GIFs (simulated)
  const gifCategories = {
    trending: [
      { id: 2, url: 'https://media.giphy.com/media/26BRuo6sLetdllPAQ/giphy.gif', alt: 'Surprised' },
      { id: 3, url: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif', alt: 'Dancing' },
      { id: 4, url: 'https://media.giphy.com/media/3o6ZtpxSZbQRRnwCKQ/giphy.gif', alt: 'Happy' },
      { id: 5, url: 'https://media.giphy.com/media/3oEjHGrVGrqgFFknfO/giphy.gif', alt: 'Thumbs Up' },
      { id: 6, url: 'https://media.giphy.com/media/3o6ZsY8dY5Gn6sZ8W0/giphy.gif', alt: 'Clapping' },
    ],
    reactions: [
      { id: 8, url: 'https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif', alt: 'Eye Roll' },
      { id: 9, url: 'https://media.giphy.com/media/3o6Zt8MgUuvSbkZYWc/giphy.gif', alt: 'Crying' },
      { id: 10, url: 'https://media.giphy.com/media/3oEjI5f7bMbcbPRQ2c/giphy.gif', alt: 'Facepalm' },
      { id: 11, url: 'https://media.giphy.com/media/3o6Zt6ML6BklcajjsA/giphy.gif', alt: 'Applause' },
    ],
    love: [
      { id: 12, url: 'https://media.giphy.com/media/3o6Zt6ML6BklcajjsA/giphy.gif', alt: 'Heart' },
      { id: 14, url: 'https://media.giphy.com/media/3o6ZtpxSZbQRRnwCKQ/giphy.gif', alt: 'Kiss' },
      { id: 15, url: 'https://media.giphy.com/media/3o6Zt5eN6sG7N9x6dK/giphy.gif', alt: 'Hug' },
    ],
    funny: [
      { id: 16, url: 'https://media.giphy.com/media/3o6Zt8MgUuvSbkZYWc/giphy.gif', alt: 'Laughing' },
      { id: 18, url: 'https://media.giphy.com/media/3o6ZtpxSZbQRRnwCKQ/giphy.gif', alt: 'Giggle' },
      { id: 19, url: 'https://media.giphy.com/media/3o6Zt5eN6sG7N9x6dK/giphy.gif', alt: 'Chuckling' },
    ],
    animals: [
      { id: 20, url: 'https://media.giphy.com/media/3o6ZtpxSZbQRRnwCKQ/giphy.gif', alt: 'Cute Cat' },
      { id: 22, url: 'https://media.giphy.com/media/3o6Zt5eN6sG7N9x6dK/giphy.gif', alt: 'Dancing Bird' },
      { id: 23, url: 'https://media.giphy.com/media/3o6Zt8MgUuvSbkZYWc/giphy.gif', alt: 'Laughing Monkey' },
    ],
    sports: [
      { id: 24, url: 'https://media.giphy.com/media/3o6Zt5eN6sG7N9x6dK/giphy.gif', alt: 'Goal Celebration' },
      { id: 25, url: 'https://media.giphy.com/media/3o6ZtpxSZbQRRnwCKQ/giphy.gif', alt: 'Slam Dunk' },
      { id: 27, url: 'https://media.giphy.com/media/3o6Zt8MgUuvSbkZYWc/giphy.gif', alt: 'Touchdown Dance' },
    ],
  };


  // Initialize favorites from local storage
  useEffect(() => {
    const storedFavorites = localStorage.getItem('gifFavorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (e) {
        console.error('Failed to load favorites', e);
      }
    }

    const storedRecent = localStorage.getItem('recentGifs');
    if (storedRecent) {
      try {
        setRecentlyUsed(JSON.parse(storedRecent));
      } catch (e) {
        console.error('Failed to load recent GIFs', e);
      }
    }

    // Focus search input when opened
    if (showGifSelector && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }
  }, [showGifSelector]);

  if (!showGifSelector) return null;

  // Simulated search function
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    // Simulate a search delay
    setTimeout(() => {
      setIsSearching(false);
    }, 600);
  };

  // Toggle favorite status
  const toggleFavorite = (gif) => {
    const isFavorite = favorites.some(fav => fav.id === gif.id);
    let newFavorites;

    if (isFavorite) {
      newFavorites = favorites.filter(fav => fav.id !== gif.id);
    } else {
      newFavorites = [...favorites, gif];
    }

    setFavorites(newFavorites);
    localStorage.setItem('gifFavorites', JSON.stringify(newFavorites));
  };

  // Handle GIF selection with recent tracking
  const selectGif = (gif) => {
    handleGifSelect(gif.url);

    // Update recently used GIFs
    const isRecent = recentlyUsed.some(recent => recent.id === gif.id);
    let newRecent;

    if (isRecent) {
      newRecent = [
        gif,
        ...recentlyUsed.filter(recent => recent.id !== gif.id)
      ];
    } else {
      newRecent = [gif, ...recentlyUsed].slice(0, 20);
    }

    setRecentlyUsed(newRecent);
    localStorage.setItem('recentGifs', JSON.stringify(newRecent));
  };

  // Simulate loading more GIFs
  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setLoadingMore(false);
    }, 800);
  };

  // Copy GIF URL to clipboard
  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopySuccess(url);
      setTimeout(() => setCopySuccess(null), 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  // Determine which GIFs to display based on selected tab and category
  const displayGifs = () => {
    if (activeTab === 'favorites') {
      return favorites;
    } else if (activeTab === 'recent') {
      return recentlyUsed;
    } else if (isSearching) {
      return []; // Empty while "searching"
    } else {
      return gifCategories[selectedCategory] || gifCategories.trending;
    }
  };

  // Check if scroll is near bottom to trigger load more
  const handleScroll = () => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      if (!loadingMore) loadMore();
    }
  };

  return (
    <div className="mt-3 p-0 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center">
          <span className="font-medium text-gray-800">GIF Library</span>
          <div className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">Premium</div>
        </div>
        <button
          type="button"
          onClick={() => setShowGifSelector(false)}
          className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-200"
        >
          <AiOutlineCloseCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          type="button"
          className={`flex items-center py-2 px-4 focus:outline-none ${activeTab === 'browse' ? 'text-indigo-600 border-b-2 border-indigo-600 font-medium' : 'text-gray-600 hover:text-gray-800'}`}
          onClick={() => setActiveTab('browse')}
        >
          <AiOutlineFire className="mr-1" /> Browse
        </button>
        <button
          type="button"
          className={`flex items-center py-2 px-4 focus:outline-none ${activeTab === 'favorites' ? 'text-indigo-600 border-b-2 border-indigo-600 font-medium' : 'text-gray-600 hover:text-gray-800'}`}
          onClick={() => setActiveTab('favorites')}
        >
          <AiOutlineStar className="mr-1" /> Favorites
        </button>
        <button
          type="button"
          className={`flex items-center py-2 px-4 focus:outline-none ${activeTab === 'recent' ? 'text-indigo-600 border-b-2 border-indigo-600 font-medium' : 'text-gray-600 hover:text-gray-800'}`}
          onClick={() => setActiveTab('recent')}
        >
          <AiOutlineHistory className="mr-1" /> Recent
        </button>
      </div>

      {/* Search bar */}
      {activeTab === 'browse' && (
        <div className="p-3 bg-white border-b border-gray-200">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for GIFs..."
              className="w-full p-2 pl-9 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
            <AiOutlineSearch className="absolute left-3 top-3 text-gray-400" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <AiOutlineCloseCircle className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
      )}

      {/* Categories */}
      {activeTab === 'browse' && !isSearching && searchQuery.trim() === '' && (
        <div className="flex overflow-x-auto p-2 bg-gray-50 border-b border-gray-200 no-scrollbar">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center whitespace-nowrap px-3 py-1.5 mr-2 rounded-full text-sm transition-colors ${selectedCategory === category.id
                  ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
            >
              <span className="mr-1">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      )}

      {/* GIF grid */}
      <div
        ref={containerRef}
        className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 overflow-y-auto"
        onScroll={handleScroll}
      >
        {isSearching ? (
          <div className="col-span-2 flex flex-col items-center justify-center h-48">
            <AiOutlineLoading3Quarters className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="mt-2 text-gray-500">Searching for "{searchQuery}"...</p>
          </div>
        ) : displayGifs().length > 0 ? (
          displayGifs().map((gif) => (
            <div
              key={gif.id}
              className="group relative overflow-hidden rounded-lg hover:ring-2 hover:ring-indigo-400 transition-all duration-200 bg-gray-100"
            >
              <img
                src={gif.url}
                alt={gif.alt}
                className="w-full h-32 object-cover cursor-pointer"
                onClick={() => selectGif(gif)}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 pointer-events-none">
                <div className="absolute bottom-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto">
                  <button
                    type="button"
                    onClick={() => toggleFavorite(gif)}
                    className={`p-1.5 rounded-full ${favorites.some(fav => fav.id === gif.id)
                      ? 'bg-red-100 text-red-600'
                      : 'bg-white text-gray-600 hover:text-red-600'}`}
                    title={favorites.some(fav => fav.id === gif.id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    {favorites.some(fav => fav.id === gif.id)
                      ? <AiFillHeart className="w-4 h-4" />
                      : <AiOutlineHeart className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(gif.url)}
                    className="p-1.5 bg-white text-gray-600 hover:text-indigo-600 rounded-full"
                    title="Copy GIF URL"
                  >
                    <AiOutlineLink className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => selectGif(gif)}
                    className="p-1.5 bg-indigo-600 text-white rounded-full"
                    title="Use this GIF"
                  >
                    <AiOutlineSend className="w-4 h-4" />
                  </button>
                </div>
                {copySuccess === gif.url && (
                  <div className="absolute top-1 right-1 bg-black bg-opacity-75 text-white text-xs py-1 px-2 rounded">
                    URL copied!
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 flex flex-col items-center justify-center h-48 text-center">
            {activeTab === 'favorites' ? (
              <>
                <AiOutlineStar className="w-12 h-12 text-gray-300" />
                <p className="mt-2 text-gray-500">No favorite GIFs yet</p>
                <button
                  type="button"
                  onClick={() => setActiveTab('browse')}
                  className="mt-2 text-indigo-600 hover:text-indigo-800"
                >
                  Browse GIFs to add favorites
                </button>
              </>
            ) : activeTab === 'recent' ? (
              <>
                <AiOutlineHistory className="w-12 h-12 text-gray-300" />
                <p className="mt-2 text-gray-500">No recently used GIFs</p>
                <button
                  type="button"
                  onClick={() => setActiveTab('browse')}
                  className="mt-2 text-indigo-600 hover:text-indigo-800"
                >
                  Browse GIFs
                </button>
              </>
            ) : (
              <>
                <AiOutlineSmile className="w-12 h-12 text-gray-300" />
                <p className="mt-2 text-gray-500">No GIFs found</p>
              </>
            )}
          </div>
        )}

        {loadingMore && (
          <div className="col-span-2 py-2 flex justify-center">
            <AiOutlineLoading3Quarters className="w-5 h-5 text-indigo-500 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostFormGifs;
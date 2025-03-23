import React, { useState, useEffect, useRef } from 'react';
import { 
  AiOutlineCloseCircle, 
  AiOutlineSmile, 
  AiOutlineInfoCircle,
  AiOutlineThunderbolt,
  AiOutlineStar,
  AiOutlineUser,
  AiOutlineHeart
} from 'react-icons/ai';
import { 
  GoLocation, 
  GoCalendar, 
  GoTag,
  GoChecklist 
} from 'react-icons/go';
import { 
  BsEmojiSmile, 
  BsEmojiNeutral, 
  BsEmojiLaughing, 
  BsEmojiHeartEyes,
  BsEmojiSunglasses,
  BsEmojiFrown,
  BsEmojiAngry,
  BsEmojiTear
} from 'react-icons/bs';
import { 
  RiMentalHealthLine, 
  RiUserHeartLine 
} from 'react-icons/ri';
import { FiCoffee, FiMusic, FiBookOpen, FiActivity } from 'react-icons/fi';

const PostFormAdvancedOptions = ({ 
  showAdvancedOptions, 
  setShowAdvancedOptions, 
  handleMoodSelect 
}) => {
  const [activeTab, setActiveTab] = useState('mood');
  const [searchTerm, setSearchTerm] = useState('');
  const [recentMoods, setRecentMoods] = useState([]);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [location, setLocation] = useState('');
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [animateSelection, setAnimateSelection] = useState(false);
  const locationInputRef = useRef(null);
  
  // Load recent moods from localStorage on component mount
  useEffect(() => {
    try {
      const storedMoods = localStorage.getItem('recentMoods');
      if (storedMoods) {
        setRecentMoods(JSON.parse(storedMoods).slice(0, 5));
      }
    } catch (error) {
      console.error('Error loading recent moods:', error);
    }
  }, []);
  
  // Focus on location input when shown
  useEffect(() => {
    if (showLocationInput && locationInputRef.current) {
      locationInputRef.current.focus();
    }
  }, [showLocationInput]);

  // Mood categories
  const moodCategories = [
    { 
      name: 'Positive', 
      icon: <BsEmojiLaughing className="text-yellow-500" />,
      moods: [
        { emoji: '😊', text: 'Happy', icon: <BsEmojiSmile /> },
        { emoji: '😁', text: 'Excited', icon: <BsEmojiLaughing /> },
        { emoji: '😎', text: 'Cool', icon: <BsEmojiSunglasses /> },
        { emoji: '😍', text: 'In love', icon: <BsEmojiHeartEyes /> },
        { emoji: '🥰', text: 'Grateful', icon: <AiOutlineHeart /> },
        { emoji: '🤩', text: 'Amazed', icon: <AiOutlineStar /> },
        { emoji: '😌', text: 'Content', icon: <RiMentalHealthLine /> },
        { emoji: '🙏', text: 'Blessed', icon: <RiUserHeartLine /> }
      ]
    },
    {
      name: 'Neutral',
      icon: <BsEmojiNeutral className="text-blue-500" />,
      moods: [
        { emoji: '🤔', text: 'Thoughtful', icon: <AiOutlineInfoCircle /> },
        { emoji: '😐', text: 'Neutral', icon: <BsEmojiNeutral /> },
        { emoji: '😶', text: 'Speechless', icon: <AiOutlineUser /> },
        { emoji: '🤷', text: 'Unsure', icon: <AiOutlineInfoCircle /> },
        { emoji: '😏', text: 'Smirking', icon: <BsEmojiSmile /> },
        { emoji: '🧐', text: 'Curious', icon: <AiOutlineInfoCircle /> }
      ]
    },
    {
      name: 'Negative',
      icon: <BsEmojiFrown className="text-red-500" />,
      moods: [
        { emoji: '😔', text: 'Sad', icon: <BsEmojiFrown /> },
        { emoji: '😢', text: 'Crying', icon: <BsEmojiTear /> },
        { emoji: '😠', text: 'Angry', icon: <BsEmojiAngry /> },
        { emoji: '😴', text: 'Tired', icon: <FiCoffee /> },
        { emoji: '😩', text: 'Exhausted', icon: <FiActivity /> },
        { emoji: '😰', text: 'Anxious', icon: <AiOutlineThunderbolt /> }
      ]
    }
  ];
  
  // Activity options
  const activityOptions = [
    { emoji: '💼', text: 'Working', icon: <FiActivity /> },
    { emoji: '🎮', text: 'Gaming', icon: <FiActivity /> },
    { emoji: '🎵', text: 'Listening to music', icon: <FiMusic /> },
    { emoji: '📚', text: 'Reading', icon: <FiBookOpen /> },
    { emoji: '☕', text: 'Having coffee', icon: <FiCoffee /> },
    { emoji: '🧘', text: 'Meditating', icon: <RiMentalHealthLine /> },
    { emoji: '🏃', text: 'Exercising', icon: <FiActivity /> },
    { emoji: '🎉', text: 'Celebrating', icon: <AiOutlineStar /> },
    { emoji: '🍽️', text: 'Eating', icon: <FiCoffee /> },
    { emoji: '✈️', text: 'Traveling', icon: <GoLocation /> },
    { emoji: '📝', text: 'Studying', icon: <FiBookOpen /> },
    { emoji: '🛒', text: 'Shopping', icon: <GoChecklist /> }
  ];

  // Consolidated all moods for search functionality
  const allMoods = moodCategories.flatMap(category => category.moods);
  const allActivities = activityOptions;
  
  // Filter moods based on search term
  const filteredMoods = searchTerm 
    ? allMoods.filter(mood => 
        mood.text.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];
    
  // Filter activities based on search term
  const filteredActivities = searchTerm 
    ? allActivities.filter(activity => 
        activity.text.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  // Handle mood selection
  const handleMoodSelection = (option) => {
    // Create a serializable version of the option without React elements
    const serializableOption = {
      emoji: option.emoji,
      text: option.text
      // Exclude the icon property which contains React elements
    };
    
    // Save to recent moods
    const updatedRecentMoods = [serializableOption, ...recentMoods.filter(m => m.text !== option.text)].slice(0, 5);
    setRecentMoods(updatedRecentMoods);
    localStorage.setItem('recentMoods', JSON.stringify(updatedRecentMoods));
    
    setSelectedMood(option);
    setAnimateSelection(true);
    
    // Combine with location if present
    let moodText = `${option.emoji} Feeling ${option.text}`;
    if (location) {
      moodText += ` at ${location}`;
    }
    
    // Add activity if selected
    if (currentActivity) {
      moodText += ` · ${currentActivity.emoji} ${currentActivity.text}`;
    }
    
    // Wait for animation before closing
    setTimeout(() => {
      handleMoodSelect(moodText);
    }, 500);
  };
  
  // Handle activity selection
  const handleActivitySelection = (activity) => {
    setCurrentActivity(activity);
    
    // If a mood is already selected, update the combined text
    if (selectedMood) {
      let moodText = `${selectedMood.emoji} Feeling ${selectedMood.text}`;
      if (location) {
        moodText += ` at ${location}`;
      }
      moodText += ` · ${activity.emoji} ${activity.text}`;
      handleMoodSelect(moodText);
    }
  };
  
  // Handle location submission
  const handleLocationSubmit = (e) => {
    e.preventDefault();
    if (location.trim()) {
      setShowLocationInput(false);
      
      // If a mood is already selected, update the combined text
      if (selectedMood) {
        let moodText = `${selectedMood.emoji} Feeling ${selectedMood.text} at ${location}`;
        if (currentActivity) {
          moodText += ` · ${currentActivity.emoji} ${currentActivity.text}`;
        }
        handleMoodSelect(moodText);
      }
    }
  };
  
  if (!showAdvancedOptions) return null;
  
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 shadow-lg bg-white animate-fadeIn">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab('mood')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'mood' 
              ? 'text-indigo-600 border-b-2 border-indigo-500' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <AiOutlineSmile className="text-lg" />
          <span>Mood</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('activity')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'activity' 
              ? 'text-indigo-600 border-b-2 border-indigo-500' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <FiActivity className="text-lg" />
          <span>Activity</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('location');
            setShowLocationInput(true);
          }}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'location' 
              ? 'text-indigo-600 border-b-2 border-indigo-500' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <GoLocation className="text-lg" />
          <span>Location</span>
        </button>
      </div>
      
      {/* Panel header */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center">
          {activeTab === 'mood' && (
            <span className="font-medium text-gray-700 flex items-center">
              <AiOutlineSmile className="mr-1.5 text-indigo-500" /> How are you feeling?
            </span>
          )}
          {activeTab === 'activity' && (
            <span className="font-medium text-gray-700 flex items-center">
              <FiActivity className="mr-1.5 text-indigo-500" /> What are you doing?
            </span>
          )}
          {activeTab === 'location' && (
            <span className="font-medium text-gray-700 flex items-center">
              <GoLocation className="mr-1.5 text-indigo-500" /> Add your location
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Search input */}
          {(activeTab === 'mood' || activeTab === 'activity') && (
            <div className="relative">
              <input
                type="text"
                placeholder={activeTab === 'mood' ? "Search moods..." : "Search activities..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-sm w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          )}
          
          <button
            type="button"
            onClick={() => setShowAdvancedOptions(false)}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <AiOutlineCloseCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Content area */}
      <div className="p-4 max-h-80 overflow-y-auto">
        {/* Mood tab content */}
        {activeTab === 'mood' && (
          <>
            {searchTerm ? (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500">Search results</h3>
                {filteredMoods.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {filteredMoods.map((option) => (
                      <button
                        key={option.text}
                        type="button"
                        className={`flex items-center space-x-2 p-2 rounded-lg transition duration-200 ${
                          selectedMood?.text === option.text
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : 'hover:bg-gray-50 text-gray-700 border-gray-100'
                        } border ${
                          selectedMood?.text === option.text && animateSelection ? 'animate-pulse' : ''
                        }`}
                        onClick={() => handleMoodSelection(option)}
                      >
                        <span className="text-xl">{option.emoji}</span>
                        <span className="text-sm font-medium">{option.text}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No moods found matching "{searchTerm}"</p>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Recent moods */}
                {recentMoods.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-500 flex items-center">
                        <GoCalendar className="mr-1.5 text-gray-400" />
                        Recent
                      </h3>
                      <button 
                        type="button"
                        className="text-xs text-gray-400 hover:text-gray-600"
                        onClick={() => {
                          setRecentMoods([]);
                          localStorage.removeItem('recentMoods');
                        }}
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentMoods.map((option) => (
                        <button
                          key={option.text}
                          type="button"
                          className="flex items-center space-x-1.5 bg-gray-50 hover:bg-gray-100 px-2.5 py-1.5 rounded-full text-gray-700 text-sm border border-gray-200 transition duration-200"
                          onClick={() => handleMoodSelection(option)}
                        >
                          <span>{option.emoji}</span>
                          <span>{option.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Mood categories */}
                <div className="space-y-5">
                  {moodCategories.map((category) => (
                    <div key={category.name} className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500 flex items-center">
                        {category.icon}
                        <span className="ml-1.5">{category.name}</span>
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {category.moods.map((option) => (
                          <button
                            key={option.text}
                            type="button"
                            className={`flex items-center space-x-2 p-2 rounded-lg transition duration-200 ${
                              selectedMood?.text === option.text
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : 'hover:bg-gray-50 text-gray-700 border-gray-100'
                            } border ${
                              selectedMood?.text === option.text && animateSelection ? 'animate-pulse' : ''
                            }`}
                            onClick={() => handleMoodSelection(option)}
                          >
                            <span className="text-xl">{option.emoji}</span>
                            <span className="text-sm font-medium">{option.text}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
        
        {/* Activity tab content */}
        {activeTab === 'activity' && (
          <>
            {searchTerm ? (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500">Search results</h3>
                {filteredActivities.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {filteredActivities.map((option) => (
                      <button
                        key={option.text}
                        type="button"
                        className={`flex items-center space-x-2 p-2 rounded-lg transition duration-200 ${
                          currentActivity?.text === option.text
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : 'hover:bg-gray-50 text-gray-700 border-gray-100'
                        } border`}
                        onClick={() => handleActivitySelection(option)}
                      >
                        <span className="text-xl">{option.emoji}</span>
                        <span className="text-sm font-medium truncate">{option.text}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No activities found matching "{searchTerm}"</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {activityOptions.map((option) => (
                  <button
                    key={option.text}
                    type="button"
                    className={`flex items-center space-x-2 p-2 rounded-lg transition duration-200 ${
                      currentActivity?.text === option.text
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : 'hover:bg-gray-50 text-gray-700 border-gray-100'
                    } border`}
                    onClick={() => handleActivitySelection(option)}
                  >
                    <span className="text-xl">{option.emoji}</span>
                    <span className="text-sm font-medium truncate">{option.text}</span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
        
        {/* Location tab content */}
        {activeTab === 'location' && (
          <>
            {showLocationInput ? (
              <form onSubmit={handleLocationSubmit} className="w-full">
                <div className="relative">
                  <GoLocation className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    ref={locationInputRef}
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter your location..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleLocationSubmit}
                    disabled={!location.trim()}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md ${
                      location.trim() 
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                {location ? (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <GoLocation className="text-indigo-500 mr-2" />
                      <span>{location}</span>
                    </div>
                    <div className="flex space-x-1">
                      <button 
                        type="button"
                        onClick={() => setShowLocationInput(true)}
                        className="p-1 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setLocation('')}
                        className="p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowLocationInput(true)}
                    className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg border border-dashed border-gray-300 hover:border-indigo-400 text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    <GoLocation />
                    <span>Add your location</span>
                  </button>
                )}
                
                {/* Popular locations - could be populated from user history or API */}
                <div className="pt-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Suggestions</h3>
                  <div className="space-y-1.5">
                    {['Home', 'Work', 'Gym', 'Coffee Shop', 'Restaurant'].map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        className="w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-50 text-left text-gray-700"
                        onClick={() => {
                          setLocation(suggestion);
                          // Update mood text if mood is selected
                          if (selectedMood) {
                            let moodText = `${selectedMood.emoji} Feeling ${selectedMood.text} at ${suggestion}`;
                            if (currentActivity) {
                              moodText += ` · ${currentActivity.emoji} ${currentActivity.text}`;
                            }
                            handleMoodSelect(moodText);
                          }
                        }}
                      >
                        <div className="flex items-center">
                          <GoLocation className="text-gray-400 mr-2" />
                          <span>{suggestion}</span>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Bottom status bar - shows current selection summary */}
      {(selectedMood || currentActivity || location) && (
        <div className="border-t border-gray-200 p-3 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            {selectedMood && (
              <span className="flex items-center">
                <span className="mr-1">{selectedMood.emoji}</span>
                <span>Feeling {selectedMood.text}</span>
              </span>
            )}
            
            {location && (
              <span className="flex items-center">
                <span className="mx-1">at</span>
                <GoLocation className="mr-1" />
                <span>{location}</span>
              </span>
            )}
            
            {currentActivity && (
              <span className="flex items-center">
                <span className="mx-1">·</span>
                <span>{currentActivity.emoji}</span>
                <span className="ml-1">{currentActivity.text}</span>
              </span>
            )}
          </div>
          
          <button
            type="button"
            onClick={() => {
              // Combine all selections into one mood text
              let moodText = '';
              if (selectedMood) {
                moodText += `${selectedMood.emoji} Feeling ${selectedMood.text}`;
                if (location) {
                  moodText += ` at ${location}`;
                }
                if (currentActivity) {
                  moodText += ` · ${currentActivity.emoji} ${currentActivity.text}`;
                }
                handleMoodSelect(moodText);
              } else if (currentActivity) {
                moodText = `${currentActivity.emoji} ${currentActivity.text}`;
                if (location) {
                  moodText += ` at ${location}`;
                }
                handleMoodSelect(moodText);
              } else if (location) {
                moodText = `📍 At ${location}`;
                handleMoodSelect(moodText);
              }
            }}
            className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

export default PostFormAdvancedOptions;
import React, { useState, useEffect } from 'react';
import {
  AiOutlineCloseCircle,
  AiOutlineBgColors,
  AiOutlineCheck,
  AiOutlinePlusCircle,
  AiOutlineHeart,
  AiOutlineFire,
  AiOutlineThunderbolt
} from 'react-icons/ai';
import {
  BsStars,
  BsSnow,
  BsWater,
  BsGradient,
  BsGrid3X3,
  BsDot
} from 'react-icons/bs';

const PostFormBackgroundOptions = ({
  showBackgroundOptions,
  setShowBackgroundOptions,
  backgroundColor,
  setBackgroundColor
}) => {
  const [selectedCategory, setSelectedCategory] = useState('solid');
  const [customColor, setCustomColor] = useState('#f0f9ff');
  const [recentColors, setRecentColors] = useState([]);
  const [showCustomPanel, setShowCustomPanel] = useState(false);
  const [animatedEntrance, setAnimatedEntrance] = useState(true);
  const [activeTab, setActiveTab] = useState('colors');
  const [intensity, setIntensity] = useState(50);
  const [showTooltip, setShowTooltip] = useState(null);

  // Define solid colors
  const solidColors = [
    { name: 'White', class: 'bg-white', hex: '#ffffff' },
    { name: 'Light Blue', class: 'bg-blue-50', hex: '#eff6ff' },
    { name: 'Light Purple', class: 'bg-purple-50', hex: '#f5f3ff' },
    { name: 'Light Green', class: 'bg-green-50', hex: '#f0fdf4' },
    { name: 'Light Yellow', class: 'bg-yellow-50', hex: '#fefce8' },
    { name: 'Light Pink', class: 'bg-pink-50', hex: '#fdf2f8' },
    { name: 'Light Red', class: 'bg-red-50', hex: '#fef2f2' },
    { name: 'Light Orange', class: 'bg-orange-50', hex: '#fff7ed' },
    { name: 'Light Teal', class: 'bg-teal-50', hex: '#f0fdfa' },
    { name: 'Light Indigo', class: 'bg-indigo-50', hex: '#eef2ff' },
    { name: 'Light Slate', class: 'bg-slate-50', hex: '#f8fafc' },
    { name: 'Light Gray', class: 'bg-gray-50', hex: '#f9fafb' }
  ];

  // Define gradients
  const gradients = [
    { name: 'Blue to Purple', class: 'bg-gradient-to-r from-blue-100 to-purple-100', value: 'bg-gradient-to-r from-blue-100 to-purple-100' },
    { name: 'Green to Blue', class: 'bg-gradient-to-r from-green-100 to-blue-100', value: 'bg-gradient-to-r from-green-100 to-blue-100' },
    { name: 'Purple to Pink', class: 'bg-gradient-to-r from-purple-100 to-pink-100', value: 'bg-gradient-to-r from-purple-100 to-pink-100' },
    { name: 'Yellow to Red', class: 'bg-gradient-to-r from-yellow-100 to-red-100', value: 'bg-gradient-to-r from-yellow-100 to-red-100' },
    { name: 'Teal to Lime', class: 'bg-gradient-to-r from-teal-100 to-lime-100', value: 'bg-gradient-to-r from-teal-100 to-lime-100' },
    { name: 'Orange to Pink', class: 'bg-gradient-to-r from-orange-100 to-pink-100', value: 'bg-gradient-to-r from-orange-100 to-pink-100' },
    { name: 'Rose to Indigo', class: 'bg-gradient-to-bl from-rose-100 to-indigo-100', value: 'bg-gradient-to-bl from-rose-100 to-indigo-100' },
    { name: 'Amber to Emerald', class: 'bg-gradient-to-tr from-amber-100 to-emerald-100', value: 'bg-gradient-to-tr from-amber-100 to-emerald-100' }
  ];

  // Define patterns
  const patterns = [
    { name: 'Dots', class: 'bg-white', value: 'bg-white pattern-dots', icon: <BsDot /> },
    { name: 'Grid', class: 'bg-gray-50', value: 'bg-gray-50 pattern-grid', icon: <BsGrid3X3 /> },
    { name: 'Stars', class: 'bg-indigo-50', value: 'bg-indigo-50 pattern-stars', icon: <BsStars /> },
    { name: 'Waves', class: 'bg-blue-50', value: 'bg-blue-50 pattern-waves', icon: <BsWater /> },
    { name: 'Snowflakes', class: 'bg-purple-50', value: 'bg-purple-50 pattern-snowflakes', icon: <BsSnow /> },
    { name: 'Hearts', class: 'bg-pink-50', value: 'bg-pink-50 pattern-hearts', icon: <AiOutlineHeart /> },
    { name: 'Confetti', class: 'bg-yellow-50', value: 'bg-yellow-50 pattern-confetti', icon: <BsStars /> },
    { name: 'Lightning', class: 'bg-amber-50', value: 'bg-amber-50 pattern-lightning', icon: <AiOutlineThunderbolt /> }
  ];

  // Show animation on mount
  useEffect(() => {
    if (showBackgroundOptions) {
      setAnimatedEntrance(true);
      const timer = setTimeout(() => {
        setAnimatedEntrance(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showBackgroundOptions]);

  // Load recent colors from localStorage
  useEffect(() => {
    const savedRecentColors = localStorage.getItem('recentBackgroundColors');
    if (savedRecentColors) {
      try {
        setRecentColors(JSON.parse(savedRecentColors).slice(0, 6));
      } catch (e) {
        console.error('Failed to load recent colors', e);
      }
    }
  }, []);

  // Function to save a color to recent colors
  const saveToRecent = (colorClass, colorHex) => {
    const newColor = { class: colorClass, hex: colorHex };
    const updatedRecent = [newColor, ...recentColors.filter(c => c.class !== colorClass)].slice(0, 6);
    setRecentColors(updatedRecent);
    localStorage.setItem('recentBackgroundColors', JSON.stringify(updatedRecent));
  };

  // Handle selecting a color
  const handleSelectColor = (colorClass, colorHex = '') => {
    setBackgroundColor(colorClass);
    if (colorHex) {
      saveToRecent(colorClass, colorHex);
    }
    // Keep panel open but smoothly transition to the selected color
    setTimeout(() => {
      setShowBackgroundOptions(false);
    }, 300);
  };

  // Handle adding custom color
  const handleAddCustomColor = () => {
    const customBgClass = `bg-[${customColor}]`;
    handleSelectColor(customBgClass, customColor);
    setShowCustomPanel(false);
  };

  if (!showBackgroundOptions) return null;

  // CSS-based texture patterns (injected as className)
  const getPatternStyle = (patternName) => {
    switch (patternName) {
      case 'pattern-dots':
        return { backgroundImage: 'radial-gradient(rgba(0,0,0,0.1) 1px, transparent 1px)', backgroundSize: '10px 10px' };
      case 'pattern-grid':
        return { backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' };
      case 'pattern-stars':
        return { backgroundImage: 'radial-gradient(circle, rgba(130,170,255,0.2) 2px, transparent 2px)', backgroundSize: '30px 30px' };
      case 'pattern-waves':
        return { backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,150,255,0.05), rgba(0,150,255,0.05) 10px, transparent 10px, transparent 20px)' };
      case 'pattern-snowflakes':
        return { backgroundImage: 'radial-gradient(rgba(150,120,250,0.2) 2px, transparent 2px)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' };
      case 'pattern-hearts':
        return { backgroundImage: 'radial-gradient(rgba(255,150,170,0.2) 2px, transparent 2px)', backgroundSize: '25px 25px' };
      case 'pattern-confetti':
        return {
          background: `repeating-linear-gradient(45deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.1) 5px, transparent 5px, transparent 10px), 
                             repeating-linear-gradient(135deg, rgba(255, 105, 180, 0.1), rgba(255, 105, 180, 0.1) 5px, transparent 5px, transparent 10px)` };
      case 'pattern-lightning':
        return { backgroundImage: 'repeating-linear-gradient(-45deg, rgba(255,200,0,0.1), rgba(255,200,0,0.1) 5px, transparent 5px, transparent 15px)' };
      default:
        return {};
    }
  };

  // Extract pattern class from space-separated string
  const getPatternClass = (value) => {
    const classes = value.split(' ');
    return classes.find(cls => cls.startsWith('pattern-')) || '';
  };

  return (
    <div className={`mt-3 p-4 bg-white rounded-lg shadow-md border border-gray-200 ${animatedEntrance ? 'animate-fadeIn' : ''}`}>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <AiOutlineBgColors className="w-5 h-5 text-gray-700 mr-2" />
          <span className="font-medium">Background Style</span>
        </div>
        <button
          type="button"
          onClick={() => setShowBackgroundOptions(false)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <AiOutlineCloseCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-3">
        <button
          type="button"
          className={`py-2 px-4 text-sm font-medium ${activeTab === 'colors' ? 'text-indigo-600 border-b-2 border-indigo-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('colors')}
        >
          Colors
        </button>
        <button
          type="button"
          className={`py-2 px-4 text-sm font-medium ${activeTab === 'gradients' ? 'text-indigo-600 border-b-2 border-indigo-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('gradients')}
        >
          Gradients
        </button>
        <button
          type="button"
          className={`py-2 px-4 text-sm font-medium ${activeTab === 'patterns' ? 'text-indigo-600 border-b-2 border-indigo-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('patterns')}
        >
          Patterns
        </button>
        <button
          type="button"
          className={`py-2 px-4 text-sm font-medium ${activeTab === 'recent' ? 'text-indigo-600 border-b-2 border-indigo-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('recent')}
        >
          Recent
        </button>
      </div>

      {/* Content area */}
      <div className="mb-3">
        {activeTab === 'colors' && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {solidColors.map((color) => (
                <div
                  key={color.class}
                  className="relative"
                  onMouseEnter={() => setShowTooltip(color.name)}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  <button
                    type="button"
                    className={`w-10 h-10 rounded-lg border shadow-sm ${backgroundColor === color.class ? 'ring-2 ring-indigo-500' : 'hover:ring-1 hover:ring-gray-400'} ${color.class}`}
                    onClick={() => handleSelectColor(color.class, color.hex)}
                    aria-label={color.name}
                  >
                    {backgroundColor === color.class && (
                      <AiOutlineCheck className="w-5 h-5 text-indigo-600 m-auto" />
                    )}
                  </button>
                  {showTooltip === color.name && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
                      {color.name}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!showCustomPanel ? (
              <button
                type="button"
                onClick={() => setShowCustomPanel(true)}
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 mt-2"
              >
                <AiOutlinePlusCircle className="w-4 h-4 mr-1" />
                Custom color
              </button>
            ) : (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <label className="block text-sm text-gray-700 mb-2">Custom color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="h-8 w-8 rounded cursor-pointer border border-gray-300"
                  />
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
                    placeholder="#rrggbb"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomColor}
                    className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'gradients' && (
          <div className="grid grid-cols-2 gap-2">
            {gradients.map((gradient) => (
              <div
                key={gradient.value}
                className="relative"
                onMouseEnter={() => setShowTooltip(gradient.name)}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <button
                  type="button"
                  className={`w-full h-12 rounded-lg border shadow-sm ${backgroundColor === gradient.value ? 'ring-2 ring-indigo-500' : 'hover:ring-1 hover:ring-gray-400'} ${gradient.class}`}
                  onClick={() => handleSelectColor(gradient.value)}
                  aria-label={gradient.name}
                >
                  {backgroundColor === gradient.value && (
                    <AiOutlineCheck className="w-5 h-5 text-indigo-600 m-auto" />
                  )}
                </button>
                {showTooltip === gradient.name && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
                    {gradient.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'patterns' && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {patterns.map((pattern) => (
                <div
                  key={pattern.value}
                  className="relative"
                  onMouseEnter={() => setShowTooltip(pattern.name)}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  <button
                    type="button"
                    className={`w-full h-16 rounded-lg border shadow-sm ${backgroundColor === pattern.value ? 'ring-2 ring-indigo-500' : 'hover:ring-1 hover:ring-gray-400'} ${pattern.class} flex items-center justify-center`}
                    onClick={() => handleSelectColor(pattern.value)}
                    aria-label={pattern.name}
                    style={getPatternStyle(getPatternClass(pattern.value))}
                  >
                    {pattern.icon && <span className="text-gray-500 opacity-50">{pattern.icon}</span>}
                    {backgroundColor === pattern.value && (
                      <AiOutlineCheck className="w-5 h-5 text-indigo-600 absolute" />
                    )}
                  </button>
                  {showTooltip === pattern.name && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
                      {pattern.name}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-2">
              <label className="block text-sm text-gray-700 mb-1">Pattern intensity</label>
              <input
                type="range"
                min="10"
                max="100"
                value={intensity}
                onChange={(e) => setIntensity(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Light</span>
                <span>Heavy</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'recent' && (
          <div>
            {recentColors.length > 0 ? (
              <div className="grid grid-cols-6 gap-2">
                {recentColors.map((color, index) => (
                  <div
                    key={index}
                    className="relative"
                    onMouseEnter={() => setShowTooltip(color.hex)}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <button
                      type="button"
                      className={`w-10 h-10 rounded-lg border shadow-sm ${backgroundColor === color.class ? 'ring-2 ring-indigo-500' : 'hover:ring-1 hover:ring-gray-400'} ${color.class}`}
                      onClick={() => handleSelectColor(color.class, color.hex)}
                      style={color.hex ? { backgroundColor: color.hex } : {}}
                      aria-label={`Color ${index + 1}`}
                    >
                      {backgroundColor === color.class && (
                        <AiOutlineCheck className="w-5 h-5 text-indigo-600 m-auto" />
                      )}
                    </button>
                    {showTooltip === color.hex && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
                        {color.hex}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                No recent colors. Select colors to save them here.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Preview section */}
      <div className="border border-gray-200 rounded-lg p-3 mb-3">
        <div className="text-sm font-medium mb-2">Preview</div>
        <div
          className={`h-16 rounded-lg ${backgroundColor} flex items-center justify-center text-gray-500`}
          style={getPatternStyle(getPatternClass(backgroundColor))}
        >
          Your post content will appear here
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={() => {
            setBackgroundColor('bg-white');
            setShowBackgroundOptions(false);
          }}
          className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => setShowBackgroundOptions(false)}
          className="px-3 py-1.5 bg-indigo-600 border border-transparent rounded-md text-sm text-white hover:bg-indigo-700"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default PostFormBackgroundOptions;
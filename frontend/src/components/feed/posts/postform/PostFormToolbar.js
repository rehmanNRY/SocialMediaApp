import React, { useState } from 'react';
import { 
  AiOutlineGif, 
  AiFillSmile 
} from 'react-icons/ai';
import { 
  MdAddPhotoAlternate, 
  MdFormatBold, 
  MdOutlineColorLens 
} from 'react-icons/md';
import { BiPoll, BiLoaderCircle } from 'react-icons/bi';
import { BsHash, BsEmojiSmile } from 'react-icons/bs';
import { FiSend } from 'react-icons/fi';
import { IoSaveOutline } from 'react-icons/io5';
import { RiDeleteBin6Line } from 'react-icons/ri';

const PostFormToolbar = ({ 
  resetAllMenus,
  setShowImageInput,
  showImageInput,
  setShowEmojis,
  showEmojis,
  setShowGifSelector,
  showGifSelector,
  setShowPollOptions,
  showPollOptions,
  setShowHashtags,
  showHashtags,
  setShowFormatting,
  showFormatting,
  setShowBackgroundOptions,
  showBackgroundOptions,
  setShowAdvancedOptions,
  showAdvancedOptions,
  isDraftSaved,
  discardDraft,
  saveDraft,
  loading
}) => {
  const [activeButton, setActiveButton] = useState(null);
  
  const handleButtonClick = (buttonName, showState, setShowState) => {
    resetAllMenus();
    setShowState(!showState);
    setActiveButton(showState ? null : buttonName);
  };

  const toolbarButtons = [
    {
      name: 'image',
      icon: <MdAddPhotoAlternate className="w-5 h-5" />,
      title: 'Add media',
      showState: showImageInput,
      setShowState: setShowImageInput
    },
    {
      name: 'emoji',
      icon: <BsEmojiSmile className="w-5 h-5" />,
      title: 'Add emoji',
      showState: showEmojis,
      setShowState: setShowEmojis
    },
    {
      name: 'gif',
      icon: <AiOutlineGif className="w-5 h-5" />,
      title: 'Add GIF',
      showState: showGifSelector,
      setShowState: setShowGifSelector
    },
    {
      name: 'poll',
      icon: <BiPoll className="w-5 h-5" />,
      title: 'Create poll',
      showState: showPollOptions,
      setShowState: setShowPollOptions
    },
    {
      name: 'hashtag',
      icon: <BsHash className="w-5 h-5" />,
      title: 'Add hashtag',
      showState: showHashtags,
      setShowState: setShowHashtags
    },
    {
      name: 'format',
      icon: <MdFormatBold className="w-5 h-5" />,
      title: 'Text formatting',
      showState: showFormatting,
      setShowState: setShowFormatting
    },
    {
      name: 'background',
      icon: <MdOutlineColorLens className="w-5 h-5" />,
      title: 'Background color',
      showState: showBackgroundOptions,
      setShowState: setShowBackgroundOptions
    },
    {
      name: 'mood',
      icon: <AiFillSmile className="w-5 h-5" />,
      title: 'Add feelings/activity',
      showState: showAdvancedOptions,
      setShowState: setShowAdvancedOptions
    }
  ];

  return (
    <div className="mt-2">
      <div className="flex flex-col gap-3">
        <div className="flex items-center flex-wrap gap-1 justify-center sm:justify-start">
          {toolbarButtons.map((button) => (
            <button
              key={button.name}
              type="button"
              onClick={() => handleButtonClick(button.name, button.showState, button.setShowState)}
              className={`relative p-2 sm:p-2 rounded-lg transition-all duration-200 ${
                button.showState
                  ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                  : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
              title={button.title}
            >
              {button.icon}
              {button.showState && (
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-indigo-700 rounded-full"></span>
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isDraftSaved && (
              <button
                type="button"
                onClick={discardDraft}
                className="flex items-center gap-1 px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                title="Discard draft"
              >
                <RiDeleteBin6Line className="w-4 h-4" />
                <span className="hidden sm:inline">Discard</span>
              </button>
            )}

            <button
              type="button"
              onClick={saveDraft}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-sm flex-1 sm:flex-none"
            >
              <IoSaveOutline className="w-4 h-4" />
              <span>Save draft</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`
              px-4 py-2 text-sm font-medium text-white 
              bg-gradient-to-r from-indigo-600 to-indigo-700
              hover:from-indigo-700 hover:to-indigo-800 
              rounded-lg transition-all duration-200 
              shadow-sm flex items-center gap-2 
              w-full sm:w-auto
              disabled:opacity-70 disabled:cursor-not-allowed 
              ${loading ? 'animate-pulse' : ''}
            `}
          >
            {loading ? (
              <>
                <BiLoaderCircle className="w-4 h-4 animate-spin" />
                <span>Posting...</span>
              </>
            ) : (
              <>
                <FiSend className="w-4 h-4" />
                <span>Post</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostFormToolbar;
"use client"
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '@/redux/posts/postsSlice';
import {
  AiOutlineInfoCircle,
} from 'react-icons/ai';

// Import all components
import {
  PostFormHeader,
  PostFormTextarea,
  PostFormImagePreview,
  PostFormMood,
  PostFormFormatting,
  PostFormBackgroundOptions,
  PostFormHashtags,
  PostFormEmojis,
  PostFormGifs,
  PostFormPoll,
  PostFormAdvancedOptions,
  PostFormImageInput,
  PostFormToolbar
} from './postform/index';
import { fetchUserDetails } from '@/redux/auth/authSlice';
import { patternStyles } from '@/constants';

const PostForm = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, userDetails } = useSelector((state) => state.auth);
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [showImageInput, setShowImageInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isClient, setIsClient] = useState(false);
  const textareaRef = useRef(null);

  // Enhanced states
  const [showHashtags, setShowHashtags] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [showFormatting, setShowFormatting] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('bg-white');
  const [charCount, setCharCount] = useState(0);
  const [showBackgroundOptions, setShowBackgroundOptions] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showGifSelector, setShowGifSelector] = useState(false);
  const [showPollOptions, setShowPollOptions] = useState(false);
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollDuration, setPollDuration] = useState(24);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [mood, setMood] = useState('');
  const [isPollSaved, setIsPollSaved] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (isLoggedIn) {
      dispatch(fetchUserDetails());
    }

    // Load draft from local storage
    const savedDraft = localStorage.getItem('postDraft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setContent(draft.content || '');
        setImage(draft.image || '');
        setIsDraftSaved(true);
      } catch (e) {
        console.error('Failed to load draft', e);
      }
    }

    // Auto save draft every 30 seconds
    const intervalId = setInterval(() => {
      if (content.trim() || image) {
        saveDraft();
      }
    }, 30000);

    // Cleanup
    return () => clearInterval(intervalId);
  }, [isLoggedIn, dispatch]);

  // Update character count when content changes
  useEffect(() => {
    setCharCount(content.length);
  }, [content]);

  const validate = () => {
    const errors = {};
    if (!content.trim() && !image && !previewImage) {
      errors.content = 'Post content or image is required.';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveDraft = () => {
    if (content.trim() || image) {
      localStorage.setItem('postDraft', JSON.stringify({ content, image }));
      setIsDraftSaved(true);

      // Show saved notification briefly
      setTimeout(() => {
        setIsDraftSaved(false);
      }, 2000);
    }
  };

  const discardDraft = () => {
    localStorage.removeItem('postDraft');
    setContent('');
    setImage('');
    setPreviewImage(null);
    setIsDraftSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      // Include poll data if poll is being created
      const postData = {
        content,
        image: previewImage || image,
        backgroundColor,
        feeling: mood || '',
      };

      if (isPollSaved && pollOptions.filter(opt => opt.trim()).length >= 2) {
        postData.pollData = {
          options: pollOptions.filter(opt => opt.trim()),
          duration: pollDuration
        };
      }

      // If a file is selected, send it via FormData through the thunk
      if (imageFile) {
        await dispatch(createPost({ ...postData, imageFile })).unwrap();
      } else {
        await dispatch(createPost(postData)).unwrap();
      }
      setContent('');
      setImage('');
      setImageFile(null);
      setPreviewImage(null);
      setShowImageInput(false);
      setShowPollOptions(false);
      setPollOptions(['', '']);
      setMood('');
      setBackgroundColor('bg-white');
      localStorage.removeItem('postDraft');
      resetAllMenus();
    } catch (error) {
      setErrors({ api: 'Failed to create post. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const resetAllMenus = () => {
    setShowImageInput(false);
    setShowHashtags(false);
    setShowEmojis(false);
    setShowFormatting(false);
    setShowBackgroundOptions(false);
    setShowGifSelector(false);
    setShowPollOptions(false);
    setShowAdvancedOptions(false);
  };

  // Handle hashtag click
  const handleHashtagClick = (hashtag) => {
    setContent((prevContent) => prevContent + ' ' + hashtag + ' ');
    setShowHashtags(false);
    textareaRef.current?.focus();
  };

  // Handle emoji click
  const handleEmojiClick = (emoji) => {
    setContent((prevContent) => prevContent + emoji);
    setShowEmojis(false);
    textareaRef.current?.focus();
  };

  // Handle GIF selection
  const handleGifSelect = (gifUrl) => {
    setImage(gifUrl);
    setPreviewImage(gifUrl);
    setImageFile(null);
    setShowGifSelector(false);
    textareaRef.current?.focus();
  };

  const handleSavePoll = () => {
    // Validate that there are at least 2 non-empty options
    if (pollOptions.filter(opt => opt.trim()).length >= 2) {
      setIsPollSaved(true);
      // Maybe show a success message or highlight
    } else {
      // Show error - need at least 2 options
    }
  };

  // Handle text formatting
  const handleFormat = (type) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let formattedText = '';
    switch (type) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `_${selectedText}_`;
        break;
      case 'underline':
        formattedText = `~${selectedText}~`;
        break;
      default:
        return;
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);

    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
    }, 0);
  };

  // Handle textarea expansion
  const handleTextareaFocus = () => {
    setIsExpanded(true);
  };

  // Handle adding poll option
  const handleAddPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
    }
  };

  // Handle removing poll option
  const handleRemovePollOption = (index) => {
    if (pollOptions.length > 2) {
      const newOptions = [...pollOptions];
      newOptions.splice(index, 1);
      setPollOptions(newOptions);
    }
  };

  // Handle poll option change
  const handlePollOptionChange = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  // Handle mood selection
  const handleMoodSelect = (emojiAndText) => {
    setMood(emojiAndText);
    setShowAdvancedOptions(false);
  };

  if (!isClient) {
    return null;
  }

  return (
    <>
      {isLoggedIn && (
        <div className={`w-full transition-all duration-300 ${isExpanded ? 'mb-10' : 'mb-4'}`}>
          <form
            onSubmit={handleSubmit}
            className={`${backgroundColor} p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 w-full mx-auto transition-all duration-300 transform ${isExpanded ? 'scale-102' : ''}`}
            style={backgroundColor.includes('pattern-') ? patternStyles[backgroundColor.split(' ').find(cls => cls.startsWith('pattern-'))] : {}}
          >
            {/* Header with user info */}
            <PostFormHeader
              userDetails={userDetails}
              isDraftSaved={isDraftSaved}
            />

            {/* Main textarea */}
            <PostFormTextarea
              content={content}
              setContent={setContent}
              charCount={charCount}
              isExpanded={isExpanded}
              backgroundColor={backgroundColor}
              textareaRef={textareaRef}
              handleTextareaFocus={handleTextareaFocus}
              userDetails={userDetails}
              style={backgroundColor.includes('pattern-') ? patternStyles[backgroundColor.split(' ').find(cls => cls.startsWith('pattern-'))] : {}}
            />

            {errors.content && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AiOutlineInfoCircle className="mr-1" /> {errors.content}
              </p>
            )}

            {/* Toolbar */}
            <PostFormToolbar
              resetAllMenus={resetAllMenus}
              setShowImageInput={setShowImageInput}
              showImageInput={showImageInput}
              setShowEmojis={setShowEmojis}
              showEmojis={showEmojis}
              setShowGifSelector={setShowGifSelector}
              showGifSelector={showGifSelector}
              setShowPollOptions={setShowPollOptions}
              showPollOptions={showPollOptions}
              setShowHashtags={setShowHashtags}
              showHashtags={showHashtags}
              setShowFormatting={setShowFormatting}
              showFormatting={showFormatting}
              setShowBackgroundOptions={setShowBackgroundOptions}
              showBackgroundOptions={showBackgroundOptions}
              setShowAdvancedOptions={setShowAdvancedOptions}
              showAdvancedOptions={showAdvancedOptions}
              isDraftSaved={isDraftSaved}
              discardDraft={discardDraft}
              saveDraft={saveDraft}
              loading={loading}
            />

            {/* Mood indicator */}
            <PostFormMood
              mood={mood}
              setMood={setMood}
            />

            {/* Formatting toolbar */}
            <PostFormFormatting
              showFormatting={showFormatting}
              setShowFormatting={setShowFormatting}
              handleFormat={handleFormat}
            />

            {/* Background color selector */}
            <PostFormBackgroundOptions
              showBackgroundOptions={showBackgroundOptions}
              setShowBackgroundOptions={setShowBackgroundOptions}
              backgroundColor={backgroundColor}
              setBackgroundColor={setBackgroundColor}
            />

            {/* Hashtag selector */}
            <PostFormHashtags
              showHashtags={showHashtags}
              setShowHashtags={setShowHashtags}
              handleHashtagClick={handleHashtagClick}
            />

            {/* Emoji selector */}
            <PostFormEmojis
              showEmojis={showEmojis}
              setShowEmojis={setShowEmojis}
              handleEmojiClick={handleEmojiClick}
            />

            {/* GIF selector */}
            <PostFormGifs
              showGifSelector={showGifSelector}
              setShowGifSelector={setShowGifSelector}
              handleGifSelect={handleGifSelect}
            />

            {/* Poll creation interface */}
            <PostFormPoll
              showPollOptions={showPollOptions}
              setShowPollOptions={setShowPollOptions}
              pollOptions={pollOptions}
              setPollOptions={setPollOptions}
              pollDuration={pollDuration}
              setPollDuration={setPollDuration}
              handleAddPollOption={handleAddPollOption}
              handleRemovePollOption={handleRemovePollOption}
              handlePollOptionChange={handlePollOptionChange}
              handleSavePoll={handleSavePoll}
              isPollSaved={isPollSaved}
              setIsPollSaved={setIsPollSaved}
            />

            {/* Advanced options - mood, location etc */}
            <PostFormAdvancedOptions
              showAdvancedOptions={showAdvancedOptions}
              setShowAdvancedOptions={setShowAdvancedOptions}
              handleMoodSelect={handleMoodSelect}
            />

            {/* Image input display area */}
            <PostFormImageInput
              showImageInput={showImageInput}
              setShowImageInput={setShowImageInput}
              image={image}
              setImage={setImage}
              setPreviewImage={setPreviewImage}
              setImageFile={setImageFile}
            />

            {/* Image preview area */}
            <PostFormImagePreview
              previewImage={previewImage}
              image={image}
              setPreviewImage={setPreviewImage}
              setImage={setImage}
              setImageFile={setImageFile}
            />

            {errors.api && (
              <div className="mt-2 p-2 bg-red-50 text-red-500 text-sm rounded-md border border-red-100">
                {errors.api}
              </div>
            )}
          </form>
        </div>
      )}
    </>
  );
};

export default PostForm;
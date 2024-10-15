"use client"
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '@/redux/posts/postsSlice';
import { AiOutlinePicture, AiOutlineCloseCircle, AiFillSmile } from 'react-icons/ai';
import { MdAddPhotoAlternate } from 'react-icons/md';
import { BiLoaderCircle } from 'react-icons/bi';
import { RiEmotionLaughLine } from 'react-icons/ri';
import { fetchUserDetails } from '@/redux/auth/authSlice';
import { BsHash } from 'react-icons/bs';

const PostForm = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, userDetails } = useSelector((state) => state.auth);
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isClient, setIsClient] = useState(false);

  // State for Hashtags and emojis
  const [showHashtags, setShowHashtags] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);

  // Sample hashtags and emojis
  const hashtags = ['#trending', '#dev', '#nature', '#love', '#blessed'];
  const emojis = ['😊', '😂', '😢', '😍', '👍'];

  useEffect(() => {
    setIsClient(true); // Mark component as client-rendered
    if (isLoggedIn) {
      dispatch(fetchUserDetails());
    }
  }, [isLoggedIn, dispatch]);

  const validate = () => {
    const errors = {};
    if (!content.trim()) {
      errors.content = 'Content is required.';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      await dispatch(createPost({ content, image })).unwrap();
      setContent('');
      setImage('');
      setShowImageInput(false);
    } catch (error) {
      setErrors({ api: 'Failed to create post. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Handle hashtag click
  const handleHashtagClick = (hashtag) => {
    setContent((prevContent) => prevContent + ' ' + hashtag);
    setShowHashtags(false);
  };

  // Handle emoji click
  const handleEmojiClick = (emoji) => {
    setContent((prevContent) => prevContent + ' ' + emoji);
    setShowEmojis(false);
  };

  if (!isClient) {
    return null; // Render nothing until client-side rendering is confirmed
  }

  return (
    <>
      {isLoggedIn && (
        <form
          onSubmit={handleSubmit}
          className={`bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 w-full mx-auto`}
        >
          <div className="flex flex-col sm:flex-row items-center mb-4 space-y-3 sm:space-y-0 sm:space-x-3">
            <img className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full shadow-md" src={userDetails?.profilePicture} />
            <h4 className="font-semibold text-gray-800 text-base sm:text-lg">What's on your mind?</h4>
          </div>

          <textarea
            className="bg-[#F8F8F9] w-full p-3 sm:p-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300 shadow-sm placeholder:italic placeholder-gray-400"
            rows="3"
            placeholder={`Share your thoughts ${userDetails?.fullName}..`}
            value={content}
            maxLength={100}
            onChange={(e) => setContent(e.target.value)}
          />
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}

          <div className="mt-2 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 sm:space-x-2">
            <div className="flex items-center space-x-2">
              <button
                className="space-x-1 hover:text-indigo-600 transition duration-200 shadow-sm bg-gray-100 rounded-md text-gray-600 px-2 py-1 text-sm HelvR flex items-center"
                type="button"
                onClick={() => setShowImageInput(!showImageInput)}
              >
                <AiOutlinePicture className="w-4 h-4 text-indigo-500" />
                <span>{showImageInput ? 'Remove Photo' : 'Add Photo'}</span>
              </button>
              <button
                className="space-x-0.5 hover:text-indigo-600 transition duration-200 shadow-sm bg-gray-100 rounded-md text-gray-600 px-2 py-1 text-sm HelvR flex items-center"
                type="button"
                onClick={() => setShowHashtags(!showHashtags)}
              >
                <BsHash className="w-4 h-4 text-green-500" />
                <span>Hashtags</span>
              </button>
              <button
                className="flex items-center space-x-1 hover:text-indigo-600 transition duration-200 shadow-sm bg-gray-100 rounded-md text-gray-600 px-2 py-1 text-sm HelvR"
                type="button"
                onClick={() => setShowEmojis(!showEmojis)}
              >
                <RiEmotionLaughLine className="w-4 h-4 text-yellow-500" />
                <span>Emoji</span>
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-500 text-white px-4 sm:px-5 py-2 sm:py-3 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 flex items-center space-x-2"
            >
              {loading ? (
                <BiLoaderCircle className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <MdAddPhotoAlternate className="w-5 h-5" />
                  <span>Post</span>
                </>
              )}
            </button>
          </div>

          {showImageInput && (
            <div className="w-full mt-2 flex items-center border border-gray-300 rounded-lg overflow-hidden animate-slideIn">
              <input
                type="text"
                placeholder="Enter image link"
                className="w-full p-2 border-none focus:outline-none"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              <AiOutlineCloseCircle
                className="pr-3 w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700 transition duration-200"
                onClick={() => setImage('')}
              />
            </div>
          )}

          {showHashtags && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg shadow-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Select a hashtag:</span>
                <AiOutlineCloseCircle
                  className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700 transition duration-200"
                  onClick={() => setShowHashtags(false)}
                />
              </div>
              <div className="mt-2 flex flex-wrap space-x-2">
                {hashtags.map((hashtag) => (
                  <button
                    key={hashtag}
                    className="bg-indigo-500 text-white px-3 py-1 rounded-full shadow-sm hover:bg-indigo-700 transition duration-200"
                    onClick={() => handleHashtagClick(hashtag)}
                  >
                    {hashtag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showEmojis && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg shadow-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Select an emoji:</span>
                <AiOutlineCloseCircle
                  className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700 transition duration-200"
                  onClick={() => setShowEmojis(false)}
                />
              </div>
              <div className="mt-2 flex space-x-2">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    className="text-2xl"
                    onClick={() => handleEmojiClick(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {errors.api && <p className="text-red-500 text-sm mt-2">{errors.api}</p>}
        </form>

      )}
    </>
  );
};

export default PostForm;

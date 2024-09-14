"use client"
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '@/redux/posts/postsSlice';
import { AiOutlinePicture, AiOutlineCloseCircle, AiFillSmile } from 'react-icons/ai';
import { MdAddPhotoAlternate } from 'react-icons/md';
import { BiLoaderCircle } from 'react-icons/bi';
import { RiEmotionLaughLine } from 'react-icons/ri';
import { fetchUserDetails } from '@/redux/auth/authSlice';

const PostForm = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, userDetails } = useSelector((state) => state.auth);
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isClient, setIsClient] = useState(false);


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
  if (!isClient) {
    return null; // Render nothing until client-side rendering is confirmed
  }
  return (
    <>
    {isLoggedIn && <form 
      onSubmit={handleSubmit} 
      className={`bg-white p-6 rounded-xl shadow-lg border border-gray-200`}
    >
      <div className="flex items-center mb-4 space-x-3">
        <img className="w-12 h-12 object-cover rounded-full shadow-md" src={userDetails?.profilePicture} />
        <h4 className="font-semibold text-gray-800 text-lg">What's on your mind?</h4>
      </div>

      <textarea
        className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300 shadow-sm placeholder:italic placeholder-gray-400"
        rows="3"
        placeholder={`Share your thoughts ${userDetails?.fullName}...`}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}

      <div className="mt-4 flex justify-between items-center space-x-2">
        <label
          className="text-sm text-indigo-600 hover:underline cursor-pointer flex items-center transition-all duration-200 ease-in-out"
          onClick={() => setShowImageInput(!showImageInput)}
        >
          <AiOutlinePicture className="mr-1 text-lg" />
          {showImageInput ? 'Remove Photo/Video' : 'Add Photo/Video'}
        </label>

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
              className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700 transition duration-200"
              onClick={() => setImage('')}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 flex items-center space-x-2"
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

      <div className="mt-4 flex space-x-3 items-center">
        <button className="flex items-center space-x-2 text-gray-500 hover:text-indigo-600 transition duration-200">
          <AiFillSmile className="w-5 h-5" />
          <span>Feelings</span>
        </button>
        <button className="flex items-center space-x-2 text-gray-500 hover:text-indigo-600 transition duration-200">
          <RiEmotionLaughLine className="w-5 h-5" />
          <span>Emoji</span>
        </button>
      </div>

      {errors.api && <p className="text-red-500 text-sm mt-2">{errors.api}</p>}
    </form>}
    </>  
  );
};

export default PostForm;
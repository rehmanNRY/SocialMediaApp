"use client"
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '@/redux/posts/postsSlice';
import { AiOutlinePicture, AiOutlineCloseCircle } from 'react-icons/ai';
import { FaUserCircle } from 'react-icons/fa';
import { MdAddPhotoAlternate } from 'react-icons/md';
import { BiLoaderCircle } from 'react-icons/bi';
import { fetchUserDetails } from '@/redux/auth/authSlice';

const PostForm = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, userDetails } = useSelector((state) => state.auth);
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchUserDetails());
    }
  }, [isLoggedIn, dispatch]);

  // Function to validate the input
  const validate = () => {
    const errors = {};
    if (!content.trim()) {
      errors.content = 'Content is required.';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Function to handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation check
    if (!validate()) return;

    setLoading(true);
    try {
      await dispatch(createPost({ content, image })).unwrap();
      console.log('Post created successfully');
      // Clear form inputs
      setContent('');
      setImage('');
      setShowImageInput(false);
    } catch (error) {
      console.error('Error creating post:', error);
      setErrors({ api: 'Failed to create post. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg transition-transform hover:scale-105">
      <div className="flex items-center mb-4">
        <img className="w-12 h-12 mr-3 object-cover rounded-full shadow-md" src={userDetails?.profilePicture} />
        <h4 className="font-semibold text-gray-800 text-lg">What's on your mind?</h4>
      </div>
      <textarea
        className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 shadow-sm"
        rows="4"
        placeholder={`Share your thoughts ${userDetails?.fullName}...`}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
      <div className="mt-4 flex justify-between items-center">
        <label
          className="text-sm text-blue-600 hover:underline cursor-pointer flex items-center"
          onClick={() => setShowImageInput(!showImageInput)}
        >
          <AiOutlinePicture className="mr-1" />
          {showImageInput ? 'Remove Photo/Video' : 'Add Photo/Video'}
        </label>
        {showImageInput && (
          <div className="w-full mt-2 flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Enter image link"
              className="w-full p-2 border-none focus:outline-none"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
            <AiOutlineCloseCircle
              className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700"
              onClick={() => setImage('')}
            />
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 flex items-center space-x-2"
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
      {errors.api && <p className="text-red-500 text-sm mt-2">{errors.api}</p>}
    </form>
  );
};

export default PostForm;

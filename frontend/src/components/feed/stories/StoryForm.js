"use client";
import React, { useState } from "react";
import { AiOutlinePicture, AiOutlineClose } from "react-icons/ai";
import { MdAddPhotoAlternate, MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { createStory } from "@/redux/story/storySlice";

const StoryForm = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.story);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dispatch the createStory action
    dispatch(createStory({ content, image }));

    // Clear the form after submission
    setContent("");
    setImage("");
    onClose();
  };

  const handleClearImage = () => {
    setImage("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
      {/* Back Home Button */}
      <div className="absolute top-4 right-4">
        <Link href="/" className="bg-gray-200 text-gray-800 px-3 py-2 rounded-full shadow hover:bg-gray-300 transition duration-200 flex items-center text-sm">
          <MdOutlineKeyboardArrowLeft />
          Back Home
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white px-8 pt-6 pb-8 rounded-2xl shadow-2xl w-full max-w-lg"
      >
        {/* Close button */}
        <div className="flex justify-end mb-4">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <AiOutlineClose className="w-6 h-6" />
          </button>
        </div>

        {/* Text area for story content */}
        <textarea
          className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:ring focus:ring-indigo-200 transition focus:outline-none focus:border-none duration-200 bg-gray-100 text-gray-700"
          rows="4"
          placeholder="Write your story here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* Add/Remove Photo Button */}
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 transition-colors"
            onClick={() => setShowImageInput(!showImageInput)}
          >
            <AiOutlinePicture className="w-6 h-6" />
            <span>{showImageInput ? "Remove Photo" : "Add Photo"}</span>
          </button>

          {/* Submit button */}
          <button
            type="submit"
            className="bg-indigo-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-indigo-600 transition duration-200 ease-in-out flex items-center"
            disabled={isLoading} // Disable button if loading
          >
            <MdAddPhotoAlternate className="w-5 h-5 mr-2" />
            <span>{isLoading ? "Posting..." : "Post Story"}</span>
          </button>
        </div>

        {/* Image URL input field */}
        {showImageInput && (
          <div className="relative mt-4 w-full flex items-center border border-gray-300 rounded-lg transition duration-200 bg-gray-50">
            <input
              type="text"
              placeholder="Enter image URL..."
              className="w-full p-3 text-sm border-none focus:outline-none rounded-lg focus:ring focus:ring-indigo-200"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
            {/* Clear input button (cross) */}
            {image && (
              <button
                type="button"
                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                onClick={handleClearImage}
              >
                <AiOutlineClose className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Error message display */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default StoryForm;

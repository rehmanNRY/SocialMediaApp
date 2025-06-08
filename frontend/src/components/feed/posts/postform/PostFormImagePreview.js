import React from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const PostFormImagePreview = ({ previewImage, image, setPreviewImage, setImage, setImageFile }) => {
  if (!previewImage && !image) return null;
  
  return (
    <div className="mt-3 relative rounded-lg overflow-hidden border border-gray-200">
      <img
        src={previewImage || image}
        alt="Preview"
        className="w-full max-h-60 object-cover"
      />
      <button
        type="button"
        onClick={() => {
          setPreviewImage(null);
          setImage('');
          if (setImageFile) setImageFile(null);
        }}
        className="absolute top-2 right-2 bg-gray-800 bg-opacity-60 text-white rounded-full p-1 hover:bg-opacity-80 transition duration-200"
      >
        <AiOutlineCloseCircle className="w-5 h-5" />
      </button>
    </div>
  );
};

export default PostFormImagePreview; 
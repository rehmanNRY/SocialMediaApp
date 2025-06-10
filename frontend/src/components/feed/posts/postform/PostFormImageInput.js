import React, { useCallback, useState } from 'react';
import { AiOutlineCloseCircle, AiOutlineLink, AiOutlineUpload, AiOutlineCamera, AiOutlineInbox } from 'react-icons/ai';

const PostFormImageInput = ({ showImageInput, setShowImageInput, image, setImage, setPreviewImage, setImageFile }) => {
  if (!showImageInput) return null;
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback((files) => {
    const file = files && files[0];
    if (!file) return;
    setImage('');
    if (setImageFile) setImageFile(file);
    if (setPreviewImage) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
    }
    setShowImageInput(false); // Close the image input when a file is selected
  }, [setImage, setImageFile, setPreviewImage, setShowImageInput]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }, [handleFiles]);

  
  return (
    <div className="mt-4 p-4 bg-white rounded-lg shadow-md border border-gray-200 transition-all duration-300" 
      style={{
        animation: 'slideIn 0.3s ease-out forwards',
      }}>
      <div className="flex justify-between items-center mb-3">
        <span className="font-semibold text-gray-800 flex items-center gap-2">
          <AiOutlineCamera className="text-indigo-500 w-5 h-5" />
          Add a photo
        </span>
        <button
          type="button"
          onClick={() => setShowImageInput(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-100"
          aria-label="Close image input"
        >
          <AiOutlineCloseCircle className="w-5 h-5" />
        </button>
      </div>

      <div
        className={`flex flex-col items-center justify-center border-2 border-dashed ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'} rounded-lg p-6 bg-gray-50 transition-colors duration-200`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
      >
        <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
          {isDragging ? (
            <AiOutlineInbox className="w-7 h-7 text-indigo-600" />
          ) : (
            <AiOutlineUpload className="w-7 h-7 text-indigo-500" />
          )}
        </div>

        <p className="text-gray-700 mb-2 text-center">Drag & drop an image here, or</p>
        <label className="inline-flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md cursor-pointer hover:bg-indigo-700 transition-colors">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          Choose file
        </label>

        <div className="w-full h-px bg-gray-200 my-4" />

        <p className="text-gray-600 mb-3 text-center">Or paste image URL</p>
        <div className="w-full relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <AiOutlineLink className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Paste an image URL here"
            className="w-full py-2.5 pl-10 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm transition-all duration-200"
            value={image}
            onChange={(e) => {
              setImage(e.target.value);
              if (e.target.value) {
                if (setImageFile) setImageFile(null);
                if (setPreviewImage) setPreviewImage(e.target.value);
              }
            }}
          />
        </div>
        {image && (
          <div className="mt-3 text-xs text-indigo-600 self-start">
            URL added successfully
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default PostFormImageInput;
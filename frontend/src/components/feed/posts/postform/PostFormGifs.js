import React from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const PostFormGifs = ({ showGifSelector, setShowGifSelector, handleGifSelect }) => {
  if (!showGifSelector) return null;
  
  // List of GIFs (simulated)
  const gifOptions = [
    { id: 1, url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWlhYmtpdWYwNjI0c3U5aXE2aDl4NWR1M29wMmVvN25lb3E3ZHB4OSZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/l0MYJnJQ4EiYLR8tW/giphy.gif', alt: 'Thinking' },
    { id: 2, url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHp2eXRnaWw3NnI0ZTE3N3lidnBtYnN3eTF1NGZrdHJvMDhvbGNtciZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/DhstvI3zZ598Nb1rFf/giphy.gif', alt: 'Nodding' },
    { id: 3, url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWppMjBveHo2ZXpncTk5bWFoc2piNW56cXM0dmFzajE2eG9jODBieiZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/Cmr1OMJ2FN0B2/giphy.gif', alt: 'Laughing' },
  ];
  
  return (
    <div className="mt-3 p-3 bg-gray-100 rounded-lg shadow-sm animate-slideIn">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium">Select a GIF</span>
        <button
          type="button"
          onClick={() => setShowGifSelector(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <AiOutlineCloseCircle className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {gifOptions.map((gif) => (
          <button
            key={gif.id}
            type="button"
            className="overflow-hidden rounded-lg hover:ring-2 hover:ring-indigo-400 transition duration-200"
            onClick={() => handleGifSelect(gif.url)}
          >
            <img src={gif.url} alt={gif.alt} className="w-24 h-20 object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default PostFormGifs; 
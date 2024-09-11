import React from "react";

const LikersModal = ({ likers, closeModal }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-lg font-semibold mb-4">Liked by</h3>
        <ul>
          {likers.map((liker) => (
            <li key={liker._id} className="flex items-center mb-2">
              <img
                src={liker.profilePicture}
                alt={liker.fullName}
                className="w-8 h-8 rounded-full mr-3"
              />
              <span>{liker.fullName}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={closeModal}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default LikersModal;
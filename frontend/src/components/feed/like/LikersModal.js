import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import React from "react";
import { MdClose } from "react-icons/md";

const LikersModal = ({ likers, closeModal }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg transform transition-all duration-300 ease-in-out scale-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl HelvM">Liked by</h3>
          <button onClick={closeModal} className="text-gray-600 hover:text-gray-900 transition duration-200">
            <MdClose size={27} />
          </button>
        </div>
        <ul className="space-y-3 max-h-60 overflow-y-auto">
          {likers.map((liker) => (
            <Link href={`/profile/${liker._id}`} key={liker._id} className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition duration-200">
              <div className="flex items-center">
                {liker.profilePicture ? (
                  <img
                    src={liker.profilePicture}
                    alt={liker.fullName}
                    className="w-10 h-10 rounded-full border-2 border-indigo-500 mr-3 object-cover"
                  />
                ) : (
                  <FaUserCircle className="w-10 h-10 text-gray-400 mr-3" />
                )}
              </div>
              <div>
                <span className="font-medium HelvM">{liker.fullName}</span>
                <p className="text-sm text-gray-500">View Profile</p>
              </div>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LikersModal;

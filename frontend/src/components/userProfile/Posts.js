import React, { useState } from 'react';
import PostForm from "@/components/feed/posts/PostForm";
import PostList from "@/components/feed/posts/PostList";
import { BsFillPostcardFill } from 'react-icons/bs';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const Posts = ({ userPosts, loggedInUserId, user, usersList }) => {
  const [showMoreUsers, setShowMoreUsers] = useState(false);
  
  return (
    <div className="bg-[#F5F6FA] px-4 py-2 shadow-md flex flex-col lg:flex-row">
      <div className="flex flex-col flex-1 space-y-4">
        {loggedInUserId === user._id && <div className="my-4"><PostForm /></div>}
        {userPosts.length > 0 ? (
          <PostList posts={userPosts} />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-10">
            <BsFillPostcardFill className="text-gray-300 text-6xl mb-4" />
            <p className="text-xl text-gray-500">List of posts the person made.</p>
            <p className="text-sm text-gray-400 mt-2">No posts to show</p>
          </div>
        )}
      </div>

      {usersList && (
        <div className="bg-white p-4 rounded-xl shadow-md mt-6 lg:mt-3.5 lg:ml-4 w-full lg:w-72 h-fit">
          <h2 className="text-lg font-semibold mb-4">People also viewed</h2>
          <AnimatePresence>
            <motion.ul className="space-y-4">
              {(showMoreUsers ? usersList : usersList.slice(0, 10)).map((person, index) => (
                <motion.li 
                  key={index} 
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`${person._id}`} className="flex items-center cursor-pointer">
                    <img
                      src={person.profilePicture}
                      alt={person.fullName}
                      className="w-10 h-10 rounded-full mr-3 object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold hover:underline capitalize">{person.fullName}</p>
                      <p className="text-xs text-gray-500">{person.bio}</p>
                    </div>
                  </Link>
                  <Link href={`profile/${person._id}`} className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-200">
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
          <button 
            className="w-full mt-4 text-sm text-indigo-600 hover:underline"
            onClick={() => setShowMoreUsers(!showMoreUsers)}
          >
            {showMoreUsers ? "Show less" : "Show more"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Posts;

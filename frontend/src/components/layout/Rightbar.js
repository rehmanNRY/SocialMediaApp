"use client";
import { useState, useEffect } from "react";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { BsGear } from "react-icons/bs";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '@/redux/users/usersSlice';
import { AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { FiHome } from "react-icons/fi";

const Rightbar = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [isClient, setIsClient] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const reversedUsers = users.slice().reverse();

  useEffect(() => {
    setIsClient(true);
    dispatch(fetchUsers());
  }, [isLoggedIn, dispatch]);

  // Hide the Rightbar for specific routes
  const hideOnPaths = ["/settings", "/contact", "/profile"];
  const shouldHideRightbar = hideOnPaths.some((path) => pathname.startsWith(path));

  if (!isClient || shouldHideRightbar) {
    return null; // Render nothing until client-side rendering is confirmed or for specified paths
  }

  return (
    <>
      {isLoggedIn && (
        <div className={`w-64 hidden md:block`}>
          <div
            className="rightBar w-64 p-4 bg-gradient-to-b from-white to-blue-50 shadow-xl flex flex-col gap-6 fixed overflow-y-auto rounded-lg"
            style={{ height: "calc(100vh - 4rem)" }}
          >

            {/* Navigation Menu */}
            <ul className="flex flex-col gap-3">
              <h4 className="text-md font-semibold text-gray-800">Menu</h4>
              <Link href="/" className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-md cursor-pointer transition hover:scale-105 duration-300">
                <FiHome className="text-indigo-600" />
                <span className="text-gray-700">Home</span>
              </Link>
              <Link href="/settings" className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-md cursor-pointer transition hover:scale-105 duration-300">
                <BsGear className="text-gray-600" />
                <span className="text-gray-700">Settings</span>
              </Link>
              <Link href="/contact" className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-md cursor-pointer transition hover:scale-105 duration-300">
                <AiOutlineAppstoreAdd className="text-pink-600" />
                <span className="text-gray-700">Contact</span>
              </Link>
            </ul>

            {/* List of Users */}
            <div className="flex flex-col gap-3 border-t pt-3">
              <h4 className="text-md font-semibold text-gray-800">Registered Users</h4>
              {users.slice(0, 3).map((user, index) => (
                <Link
                  key={index}
                  href={`profile/${user?._id}`}
                  className="flex items-center p-2 rounded-md hover:bg-gray-100 transition cursor-pointer hover:scale-105 duration-300"
                >
                  <img
                    src={user?.profilePicture || "/default-profile.jpg"}
                    alt={user?.fullName}
                    className="rounded-full h-12 w-12 mr-2 object-cover"
                  />
                  <div className="flex flex-col">
                    <p className="text-black text-base HelvM">{user?.fullName}</p>
                    <span className="text-xs text-gray-500 HelvR">@{user?.username}</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Suggested Users with Show More */}
            <div className="flex flex-col gap-3 border-t py-3">
              <h4 className="text-md font-semibold text-gray-800">Suggested Users</h4>
              <AnimatePresence>
                {(showMore ? reversedUsers : reversedUsers.slice(0, 3)).map((user, index) => (
                  <Link
                    href={`profile/${user?._id}`}
                    key={index}
                    className="hover:scale-105 duration-300 flex items-center p-2 rounded-md hover:bg-gray-100 transition cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <img
                      src={user?.profilePicture || "/default-profile.jpg"}
                      alt={user?.fullName}
                      className="rounded-full h-12 w-12 mr-2 object-cover"
                    />
                    <div className="flex flex-col">
                      <p className="text-black text-base HelvM">{user?.fullName}</p>
                      <span className="text-xs text-gray-500 HelvR">@{user?.username}</span>
                    </div>
                  </Link>
                ))}
              </AnimatePresence>
              <button
                onClick={() => setShowMore(!showMore)}
                className="text-blue-600 text-sm mt-2 hover:underline"
              >
                {showMore ? "Show Less" : "Show More"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Rightbar;

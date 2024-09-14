"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {
  sendFriendRequest,
  cancelSentRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  unfriend,
  fetchSentRequests,
  fetchReceivedRequests,
  fetchFriendsList,
} from '@/redux/friendRequests/friendRequestsSlice';
import { getAllPosts } from '@/redux/posts/postsSlice';
import AuthRedirect from '@/components/AuthRedirect';
import { FiHome, FiUser, FiList, FiAlertCircle, FiUserPlus } from 'react-icons/fi';
import { AiOutlineFileText } from 'react-icons/ai';
import { fetchUsers } from '@/redux/users/usersSlice';
import { motion } from 'framer-motion';

import ProfileInfo from '@/components/userProfile/ProfileInfo';
import FriendList from '@/components/userProfile/FriendList';
import Followers from '@/components/userProfile/Followers';
import Following from '@/components/userProfile/Following';
import Posts from '@/components/userProfile/Posts';
import StatsSection from '@/components/userProfile/StatsSection';

const UserProfile = ({ params }) => {
  const [user, setUser] = useState(null);
  const users = useSelector((state) => state.users.users);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const userPosts = posts.filter((post) => post.user._id === user?._id);
  const sentRequests = useSelector((state) => state.friendRequests.sentRequests);
  const receivedRequests = useSelector((state) => state.friendRequests.receivedRequests);
  const friendsList = useSelector((state) => state.friendRequests.friendsList);
  const loggedInUserId = useSelector((state) => state.auth.userDetails?._id);

  useEffect(() => {
    dispatch(getAllPosts());
    dispatch(fetchUsers());
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/user/userDetails/${params.profileId}`);
        setUser(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user details');
        setLoading(false);
      }
    };
    fetchUserDetails();
    dispatch(fetchSentRequests());
    dispatch(fetchReceivedRequests());
    dispatch(fetchFriendsList());
  }, [params.profileId, dispatch]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  // Check friendship status and requests
  const isFriend = friendsList.some((friend) => friend._id === user._id);
  const hasSentRequest = sentRequests.some((req) => req.receiver._id === user._id);
  const sentRequestId = sentRequests.find((req) => req.receiver._id === user._id)?._id;
  const hasReceivedRequest = receivedRequests.some((req) => req.sender._id === user._id);
  const receivedRequestId = receivedRequests.find((req) => req.sender._id === user._id)?._id;

  // Handle friend request actions
  const handleSendRequest = () => {
    dispatch(sendFriendRequest(user._id));
    dispatch(fetchSentRequests());
  };

  const handleCancelRequest = () => {
    dispatch(cancelSentRequest(sentRequestId));
  };

  const handleAcceptRequest = () => {
    dispatch(acceptFriendRequest(receivedRequestId));
    dispatch(fetchFriendsList());
  };

  const handleRejectRequest = () => {
    dispatch(rejectFriendRequest(receivedRequestId));
  };

  const handleUnfriend = () => {
    dispatch(unfriend(user._id));
    dispatch(fetchFriendsList());
  };

  return (
    <AuthRedirect>
      <div className="min-h-screen bg-[#F5F6FA] flex justify-center items-center p-3">
        <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header section */}
          <motion.div
            className="relative h-80 bg-gradient-to-r from-blue-500 to-purple-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="https://ih1.redbubble.net/cover.4093136.2400x600.jpg"
              alt="Cover"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div className="relative p-6 flex items-center" whileHover={{ scale: 1.05 }}>
            <div className="absolute -top-24 left-6">
              <img
                src={user.profilePicture || "https://via.placeholder.com/150"}
                alt={user.fullName}
                className="w-52 h-52 rounded-full border-4 border-white shadow-lg hover:scale-105 transition-transform"
              />
            </div>
            <div className="ml-56 mr-7 flex justify-between items-center flex-1">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user.fullName}</h1>
                <p className="text-sm text-gray-500">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                <p className="text-md text-gray-700">{user.bio}</p>
              </div>
              {loggedInUserId === user._id && (
                <button className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-blue-600 transition duration-300">
                  Your Profile
                </button>
              )}
              {loggedInUserId !== user._id && (
                <div className="space-x-2">
                  {isFriend ? (
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                      onClick={handleUnfriend}
                    >
                      Unfriend
                    </button>
                  ) : hasReceivedRequest ? (
                    <>
                      <button
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                        onClick={handleAcceptRequest}
                      >
                        Accept
                      </button>
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                        onClick={handleRejectRequest}
                      >
                        Reject
                      </button>
                    </>
                  ) : hasSentRequest ? (
                    <button
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300"
                      onClick={handleCancelRequest}
                    >
                      Cancel Request
                    </button>
                  ) : (
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                      onClick={handleSendRequest}
                    >
                      Add Friend
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          <nav className="border-b border-gray-200 mb-2 mt-2">
            <ul className="flex space-x-4">
              {menuItems.map((item) => (
                <li key={item.label} className="relative group">
                  <a
                    href={item.href}
                    className="flex items-center px-6 py-3 text-sm font-medium rounded-lg hover:bg-[#F6F8FF] hover:text-blue-700 transition duration-300"
                  >
                    {item.icon}
                    <span className="ml-4">{item.label}</span>
                  </a>
                  <div className="absolute left-0 bottom-0 h-0.5 w-full bg-blue-500 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                </li>
              ))}
            </ul>
          </nav>

          <StatsSection user={user} />
          <ProfileInfo user={user} />
          <FriendList users={users} user={user} />
          <Followers users={users} user={user} />
          <Following users={users} user={user} />
          <Posts userPosts={userPosts} loggedInUserId={loggedInUserId} user={user} />
        </div>
      </div>
    </AuthRedirect>
  );
};

// Menu items data
const menuItems = [
  {
    label: 'Profile',
    href: '/',
    icon: <FiHome className="w-6 h-6 text-blue-500" />,
  },
  {
    label: 'Profile Info',
    href: '/',
    icon: <FiUser className="w-6 h-6 text-green-500" />,
  },
  {
    label: 'Friend List',
    href: '/friends',
    icon: <FiList className="w-6 h-6 text-orange-500" />,
  },
  {
    label: 'Followers',
    href: '/pending-requests',
    icon: <FiAlertCircle className="w-6 h-6 text-yellow-500" />,
  },
  {
    label: 'Following',
    href: '/sent-requests',
    icon: <AiOutlineFileText className="w-6 h-6 text-teal-500" />,
  },
  {
    label: 'Posts',
    href: '/people',
    icon: <FiUserPlus className="w-6 h-6 text-pink-500" />,
  },
];

export default UserProfile;

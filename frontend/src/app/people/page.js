"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '@/redux/users/usersSlice';
import Link from 'next/link';
import {
  fetchSentRequests,
  fetchReceivedRequests,
  fetchFriendsList,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelSentRequest,
  unfriend,
} from '@/redux/friendRequests/friendRequestsSlice';
import { fetchUserDetails } from '@/redux/auth/authSlice';
import AuthRedirect from '@/components/AuthRedirect';
import { useLoading } from '@/components/LoadingProvider';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUserPlus, FiUserX, FiUserCheck, FiSearch, FiFilter,
  FiRefreshCw, FiX, FiCheck, FiClock, FiStar, FiMessageCircle,
  FiEye, FiChevronDown, FiChevronUp, FiUsers, FiHeart
} from 'react-icons/fi';
import { IoExpandSharp } from 'react-icons/io5';

const FriendsSuggestion = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const sentRequests = useSelector((state) => state.friendRequests.sentRequests);
  const receivedRequests = useSelector((state) => state.friendRequests.receivedRequests);
  const friendsList = useSelector((state) => state.friendRequests.friendsList);
  const { userDetails } = useSelector((state) => state.auth);
  const loggedInUserId = userDetails?._id;
  const { showLoadingFor } = useLoading();

  // Local state for optimistic updates
  const [optimisticSentRequests, setOptimisticSentRequests] = useState([]);
  const [optimisticReceivedRequests, setOptimisticReceivedRequests] = useState([]);
  const [optimisticFriendsList, setOptimisticFriendsList] = useState([]);

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('suggestions');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const searchInputRef = useRef(null);

  const status = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
    dispatch(fetchUserDetails());
    dispatch(fetchSentRequests());
    dispatch(fetchReceivedRequests());
    dispatch(fetchFriendsList());
  }, [status, dispatch]);

  // Update optimistic states when Redux state changes
  useEffect(() => {
    setOptimisticSentRequests(sentRequests);
  }, [sentRequests]);

  useEffect(() => {
    setOptimisticReceivedRequests(receivedRequests);
  }, [receivedRequests]);

  useEffect(() => {
    setOptimisticFriendsList(friendsList);
  }, [friendsList]);

  const refreshData = () => {
    setIsRefreshing(true);
    Promise.all([
      dispatch(fetchUsers()),
      dispatch(fetchSentRequests()),
      dispatch(fetchReceivedRequests()),
      dispatch(fetchFriendsList())
    ]).finally(() => {
      setTimeout(() => setIsRefreshing(false), 800);
    });
  };

  const handleSendRequest = async (receiverId) => {
    // Optimistically update UI
    const receiver = users.find(user => user._id === receiverId);
    if (receiver) {
      const optimisticRequest = {
        _id: `temp-${Date.now()}`, // Temporary ID
        receiver: {
          _id: receiverId,
          fullName: receiver.fullName,
          username: receiver.username,
          profilePicture: receiver.profilePicture
        }
      };
      setOptimisticSentRequests([...optimisticSentRequests, optimisticRequest]);
    }

    // Make the actual API call
    dispatch(sendFriendRequest(receiverId));
  };

  const handleAcceptRequest = (requestId) => {
    // Find the request to get the sender info
    const request = optimisticReceivedRequests.find(req => req._id === requestId);

    if (request) {
      // Optimistically update UI
      // 1. Remove from received requests
      setOptimisticReceivedRequests(
        optimisticReceivedRequests.filter(req => req._id !== requestId)
      );

      // 2. Add to friends list
      setOptimisticFriendsList([...optimisticFriendsList, request.sender]);
    }

    // Make the actual API call
    dispatch(acceptFriendRequest(requestId));
    dispatch(fetchFriendsList());
  };

  const handleRejectRequest = (requestId) => {
    // Optimistically update UI
    setOptimisticReceivedRequests(
      optimisticReceivedRequests.filter(req => req._id !== requestId)
    );

    // Make the actual API call
    dispatch(rejectFriendRequest(requestId));
  };

  const handleCancelRequest = (requestId) => {
    // Optimistically update UI
    setOptimisticSentRequests(
      optimisticSentRequests.filter(req => req._id !== requestId)
    );

    // Make the actual API call
    dispatch(cancelSentRequest(requestId));
  };

  const handleUnfriend = (friendId) => {
    // Optimistically update UI
    setOptimisticFriendsList(
      optimisticFriendsList.filter(friend => friend._id !== friendId)
    );

    // Make the actual API call
    dispatch(unfriend(friendId));
  };

  // Filter and sort users
  const filteredUsers = users.filter(user => {
    // Search filter
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase());

    // Category filter
    if (filterBy === 'all') return matchesSearch;
    if (filterBy === 'friends') return optimisticFriendsList.some(friend => friend._id === user._id) && matchesSearch;
    if (filterBy === 'requests') return optimisticReceivedRequests.some(req => req.sender._id === user._id) && matchesSearch;
    if (filterBy === 'sent') return optimisticSentRequests.some(req => req.receiver._id === user._id) && matchesSearch;
    if (filterBy === 'favorites') return favorites.includes(user._id) && matchesSearch;

    return matchesSearch;
  }).sort((a, b) => {
    // Sort users
    if (sortBy === 'name') return a.fullName.localeCompare(b.fullName);
    if (sortBy === 'username') return a.username.localeCompare(b.username);
    if (sortBy === 'recent') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'favorites') {
      const aIsFav = favorites.includes(a._id);
      const bIsFav = favorites.includes(b._id);
      return bIsFav - aIsFav;
    }
    return 0;
  });

  // Get users for the active tab
  const getTabUsers = () => {
    if (activeTab === 'suggestions') {
      return filteredUsers.filter(user =>
        user._id !== loggedInUserId &&
        !optimisticFriendsList.some(friend => friend._id === user._id) &&
        !optimisticSentRequests.some(req => req.receiver._id === user._id) &&
        !optimisticReceivedRequests.some(req => req.sender._id === user._id)
      );
    }
    if (activeTab === 'friends') {
      return filteredUsers.filter(user =>
        optimisticFriendsList.some(friend => friend._id === user._id)
      );
    }
    if (activeTab === 'requests') {
      return filteredUsers.filter(user =>
        optimisticReceivedRequests.some(req => req.sender._id === user._id)
      );
    }
    if (activeTab === 'sent') {
      return filteredUsers.filter(user =>
        optimisticSentRequests.some(req => req.receiver._id === user._id)
      );
    }
    return [];
  };

  const tabUsers = getTabUsers();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg"
      >
        <div className="flex items-center justify-center text-red-500 mb-4">
          <FiX size={40} />
        </div>
        <h3 className="text-xl font-bold text-center text-gray-800 mb-2">Error Loading Data</h3>
        <p className="text-center text-gray-600 mb-4">{error}</p>
        <button
          onClick={refreshData}
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center"
        >
          <FiRefreshCw className="mr-2" /> Try Again
        </button>
      </motion.div>
    );
  }
  const UserCard = ({ user }) => {
    const isFriend = optimisticFriendsList.some((friend) => friend._id === user._id);
    const hasSentRequest = optimisticSentRequests.some((req) => req.receiver._id === user._id);
    const sentRequestId = optimisticSentRequests.find((req) => req.receiver._id === user._id)?._id;
    const hasReceivedRequest = optimisticReceivedRequests.some((req) => req.sender._id === user._id);
    const receivedRequestId = optimisticReceivedRequests.find((req) => req.sender._id === user._id)?._id;
    const isFavorite = favorites.includes(user._id);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
        className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 relative group"
      >
        <div className="relative">
          {/* Cover image with gradient overlay */}
          <div className="h-28 bg-gradient-to-r from-blue-400 to-indigo-500 relative">
            <img 
              src={user.coverImage} 
              className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-105' 
              alt={user.fullName} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-50"></div>
          </div>

          {/* Expand button with animation */}
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedUser(user);
            }}
            whileHover={{ scale: 1.2, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-3 right-3 z-10 bg-white/90 p-2 rounded-full shadow-md backdrop-blur-sm"
          >
            <IoExpandSharp size={16} className="text-blue-600" />
          </motion.button>

          {/* Profile picture with animation */}
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
            <Link href={`profile/${user._id}`}>
              <motion.div
                whileHover={{ scale: 1.08, y: -5 }}
                className="w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-lg group-hover:border-blue-100 transition-all duration-300"
              >
                <img
                  src={user.profilePicture}
                  alt={user.fullName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </motion.div>
            </Link>
          </div>
        </div>

        <div className="pt-14 pb-5 px-5">
          <div className="text-center mb-4">
            <Link href={`profile/${user._id}`} className="group">
              <h3 className="font-bold text-gray-800 text-lg capitalize group-hover:text-blue-600 transition-colors duration-300">{user.fullName}</h3>
            </Link>
            <p className="text-sm text-blue-500 font-medium">@{user.username}</p>
            <div className="mt-2 h-10">
              <p className="text-sm text-gray-600 line-clamp-2 italic bg-gray-50 p-1.5 rounded-lg">{user.bio || "No bio available"}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <Link
              href={`profile/${user._id}`}
              className="w-full py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center justify-center group"
            >
              <FiEye className="mr-2 group-hover:scale-110 transition-transform duration-300" /> 
              <span className="group-hover:translate-x-0.5 transition-transform duration-300">View Profile</span>
            </Link>
            
            {user._id === loggedInUserId ? (
              <button className="w-full py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl cursor-not-allowed opacity-70">
                <span className="flex items-center justify-center">
                  <FiUserCheck className="mr-2" /> Your Profile
                </span>
              </button>
            ) : isFriend ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow"
                onClick={() => handleUnfriend(user._id)}
              >
                <FiUserX className="mr-2" /> Unfriend
              </motion.button>
            ) : hasReceivedRequest ? (
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow"
                  onClick={() => handleAcceptRequest(receivedRequestId)}
                >
                  <FiCheck className="mr-1.5" /> Accept
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow"
                  onClick={() => handleRejectRequest(receivedRequestId)}
                >
                  <FiX className="mr-1.5" /> Reject
                </motion.button>
              </div>
            ) : hasSentRequest ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow"
                onClick={() => handleCancelRequest(sentRequestId)}
              >
                <FiClock className="mr-2 animate-pulse" /> Cancel Request
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow"
                onClick={() => handleSendRequest(user._id)}
              >
                <FiUserPlus className="mr-2" /> Add Friend
              </motion.button>
            )}
          </div>
        </div>
        
        {/* Status indicator */}
        {(isFriend || hasReceivedRequest || hasSentRequest) && (
          <div className="absolute top-0 left-0 m-3">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`p-1.5 rounded-full ${
                isFriend ? "bg-green-500" : 
                hasReceivedRequest ? "bg-amber-500" : 
                "bg-blue-500"
              } shadow-md`}
            >
              {isFriend && <FiUserCheck size={12} className="text-white" />}
              {hasReceivedRequest && <FiClock size={12} className="text-white" />}
              {hasSentRequest && <FiClock size={12} className="text-white" />}
            </motion.div>
          </div>
        )}
      </motion.div>
    );
  };

  const UserListItem = ({ user }) => {
    const isFriend = optimisticFriendsList.some((friend) => friend._id === user._id);
    const hasSentRequest = optimisticSentRequests.some((req) => req.receiver._id === user._id);
    const sentRequestId = optimisticSentRequests.find((req) => req.receiver._id === user._id)?._id;
    const hasReceivedRequest = optimisticReceivedRequests.some((req) => req.sender._id === user._id);
    const receivedRequestId = optimisticReceivedRequests.find((req) => req.sender._id === user._id)?._id;
    const isFavorite = favorites.includes(user._id);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ scale: 1.01 }}
        className="flex items-center justify-between p-5 bg-white/90 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 backdrop-blur-lg"
      >
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <Link href={`profile/${user._id}`}>
              <motion.div
                whileHover={{ scale: 1.12 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-blue-200 transition-all duration-300 group-hover:border-blue-400 shadow-md"
              >
                <img
                  src={user.profilePicture}
                  alt={user.fullName}
                  className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            </Link>
          </div>

          <div className="flex flex-col">
            <Link href={`profile/${user._id}`} className="group">
              <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors text-lg">
                {user.fullName}
              </h3>
            </Link>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-blue-500 font-medium">@{user.username}</p>
              {user.isDpVerify && (
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="text-blue-500 bg-blue-100 p-0.5 rounded-full"
                >
                  <FiCheck size={12} />
                </motion.div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{user.bio || "No bio available"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.15, y: -2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400 }}
            onClick={() => setSelectedUser(user)}
            className={`p-2.5 rounded-xl ${isFavorite
                ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-600 shadow-sm'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              } transition-all duration-300`}
            aria-label="View details"
          >
            <FiEye size={18} className={isFavorite ? 'fill-current' : ''} />
          </motion.button>

          <button
            onClick={() => setSelectedUser(user)}
            className="p-2.5 text-blue-500 hover:bg-blue-50 rounded-xl transition-all duration-300 hover:text-blue-700 hover:shadow-sm"
            aria-label="View profile"
          >
            <IoExpandSharp size={18} />
          </button>

          {user._id === loggedInUserId ? (
            <span className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl border border-gray-200">
              You
            </span>
          ) : isFriend ? (
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center"
              onClick={() => handleUnfriend(user._id)}
            >
              <FiUserX className="mr-1.5" size={14} /> Unfriend
            </motion.button>
          ) : hasReceivedRequest ? (
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center"
                onClick={() => handleAcceptRequest(receivedRequestId)}
              >
                <FiCheck className="mr-1.5" size={14} /> Accept
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center"
                onClick={() => handleRejectRequest(receivedRequestId)}
              >
                <FiX className="mr-1.5" size={14} /> Reject
              </motion.button>
            </div>
          ) : hasSentRequest ? (
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center"
              onClick={() => handleCancelRequest(sentRequestId)}
            >
              <FiClock className="mr-1.5" size={14} />
              <motion.span
                initial={{ opacity: 1 }}
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                Pending
              </motion.span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center"
              onClick={() => handleSendRequest(user._id)}
            >
              <FiUserPlus className="mr-1.5" size={14} /> Connect
            </motion.button>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <AuthRedirect>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 pb-10"
      >
        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">People</h1>
                <p className="text-sm text-gray-500">Connect with friends and discover new people</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative flex-1 md:w-64">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search people..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  />
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <FiX size={16} />
                    </button>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors relative"
                >
                  <FiFilter size={20} />
                  {filterBy !== 'all' && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></span>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={refreshData}
                  className={`p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
                >
                  <FiRefreshCw size={20} />
                </motion.button>

                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="8" y1="6" x2="21" y2="6"></line>
                      <line x1="8" y1="12" x2="21" y2="12"></line>
                      <line x1="8" y1="18" x2="21" y2="18"></line>
                      <line x1="3" y1="6" x2="3.01" y2="6"></line>
                      <line x1="3" y1="12" x2="3.01" y2="12"></line>
                      <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Filter dropdown */}
            <AnimatePresence>
              {filterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-4 p-4 bg-white rounded-xl shadow-lg border border-gray-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Filter By</h3>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: 'all', label: 'All', icon: <FiUsers /> },
                          { id: 'friends', label: 'Friends', icon: <FiUserCheck /> },
                          { id: 'requests', label: 'Requests', icon: <FiUserPlus /> },
                          { id: 'sent', label: 'Sent', icon: <FiClock /> },
                          { id: 'favorites', label: 'Favorites', icon: <FiHeart /> },
                        ].map((filter) => (
                          <button
                            key={filter.id}
                            onClick={() => setFilterBy(filter.id)}
                            className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1 ${filterBy === filter.id
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                          >
                            {filter.icon}
                            {filter.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Sort By</h3>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: 'name', label: 'Name' },
                          { id: 'username', label: 'Username' },
                          { id: 'recent', label: 'Recently Joined' },
                          { id: 'favorites', label: 'Favorites First' },
                        ].map((sort) => (
                          <button
                            key={sort.id}
                            onClick={() => setSortBy(sort.id)}
                            className={`px-3 py-1.5 rounded-full text-sm ${sortBy === sort.id
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                          >
                            {sort.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tabs */}
            <div className="flex overflow-x-auto mt-4 pb-1 gap-2">
              {[
                { id: 'suggestions', label: 'Suggestions', icon: <FiUserPlus /> },
                { id: 'friends', label: 'Friends', icon: <FiUserCheck />, count: optimisticFriendsList.length },
                { id: 'requests', label: 'Requests', icon: <FiClock />, count: optimisticReceivedRequests.length },
                { id: 'sent', label: 'Sent', icon: <FiClock />, count: optimisticSentRequests.length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium flex items-center whitespace-nowrap ${activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                >
                  {tab.icon}
                  <span className="ml-1">{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-white text-blue-500' : 'bg-blue-500 text-white'
                      }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="container mx-auto px-4 py-6">
          {/* Status messages */}
          {tabUsers.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-md p-8 text-center"
            >
              <div className="flex justify-center mb-4">
                {activeTab === 'suggestions' && <FiUserPlus size={48} className="text-blue-400" />}
                {activeTab === 'friends' && <FiUserCheck size={48} className="text-green-400" />}
                {activeTab === 'requests' && <FiClock size={48} className="text-amber-400" />}
                {activeTab === 'sent' && <FiClock size={48} className="text-purple-400" />}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {activeTab === 'suggestions' && "No Suggestions Available"}
                {activeTab === 'friends' && "No Friends Yet"}
                {activeTab === 'requests' && "No Friend Requests"}
                {activeTab === 'sent' && "No Sent Requests"}
              </h3>
              <p className="text-gray-600 mb-6">
                {activeTab === 'suggestions' && "We'll suggest people you might know once you start using the platform more."}
                {activeTab === 'friends' && "Start connecting with others by sending friend requests."}
                {activeTab === 'requests' && "When someone sends you a friend request, it will appear here."}
                {activeTab === 'sent' && "Friend requests you've sent will appear here."}
              </p>
              {activeTab === 'suggestions' && (
                <button
                  onClick={refreshData}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center mx-auto"
                >
                  <FiRefreshCw className="mr-2" /> Refresh
                </button>
              )}
            </motion.div>
          )}

          {/* User grid/list */}
          {tabUsers.length > 0 && (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              <AnimatePresence>
                {tabUsers.map(user => (
                  <motion.div
                    key={user._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    {viewMode === 'grid' ? (
                      <UserCard user={user} />
                    ) : (
                      <UserListItem user={user} />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* User detail modal */}
        <AnimatePresence>
          {selectedUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-700 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedUser(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative h-40 overflow-hidden">
                  <motion.img 
                    src={selectedUser.coverImage} 
                    className='h-full w-full object-cover' 
                    alt={selectedUser.fullName}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-all shadow-md"
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiX size={18} />
                  </button>
                </div>

                <div className="px-6 pt-14 pb-6 -mt-12 relative z-10">
                  <motion.div 
                    className="flex justify-center -mt-16 mb-4"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <img
                      src={selectedUser.profilePicture}
                      alt={selectedUser.fullName}
                      className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                    {selectedUser.isDpVerify && (
                      <div className="absolute bottom-0 right-1/2 translate-x-10 translate-y-1">
                        <div className="bg-blue-500 rounded-full p-1 border-2 border-white">
                          <FiCheck size={12} className="text-white" />
                        </div>
                      </div>
                    )}
                  </motion.div>

                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">{selectedUser.fullName}</h3>
                    <p className="text-blue-500 font-medium">@{selectedUser.username}</p>
                    <div className="mt-3 px-4 py-2 bg-gray-50 rounded-lg mx-auto max-w-xs">
                      <p className="text-gray-600 italic text-sm">{selectedUser.bio || "No bio available"}</p>
                    </div>
                    
                    {selectedUser.location && (
                      <div className="flex items-center justify-center mt-3 text-gray-500">
                        <FiMapPin className="mr-1" size={14} />
                        <span className="text-sm">{selectedUser.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center gap-3 mb-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href={`profile/${selectedUser._id}`}
                        className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center shadow-md"
                      >
                        <FiEye className="mr-2" /> View Profile
                      </Link>
                    </motion.div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors flex items-center shadow-md"
                    >
                      <FiUserPlus className="mr-2" /> Add Friend
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AuthRedirect>
  );
};

export default FriendsSuggestion;

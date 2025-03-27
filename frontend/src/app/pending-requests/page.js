"use client"
import React, { useEffect, useState, useRef } from 'react';
import {
  fetchReceivedRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} from '@/redux/friendRequests/friendRequestsSlice';
import { useDispatch, useSelector } from 'react-redux';
import AuthRedirect from '@/components/AuthRedirect';
import { 
  FiUserCheck, 
  FiUserX, 
  FiSearch, 
  FiRefreshCw, 
  FiX, 
  FiCheck, 
  FiEye,
  FiFilter,
  FiUsers,
  FiClock 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { IoExpandSharp } from 'react-icons/io5';
import { useLoading } from '@/components/LoadingProvider';

const PendingRequests = () => {
  const dispatch = useDispatch();
  const receivedRequests = useSelector((state) => state.friendRequests.receivedRequests);
  const { userDetails } = useSelector((state) => state.auth);
  const { showLoadingFor } = useLoading();
  
  // UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const searchInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchReceivedRequests());
  }, [dispatch]);

  const refreshData = () => {
    setIsRefreshing(true);
    dispatch(fetchReceivedRequests()).finally(() => {
      setTimeout(() => setIsRefreshing(false), 800);
    });
  };

  const handleAcceptRequest = (requestId) => {
    dispatch(acceptFriendRequest(requestId));
  };

  const handleRejectRequest = (requestId) => {
    dispatch(rejectFriendRequest(requestId));
  };

  // Filter requests by search term
  const filteredRequests = receivedRequests.filter(request => {
    const sender = request.sender;
    return sender.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sender.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sender.bio && sender.bio.toLowerCase().includes(searchTerm.toLowerCase()));
  }).sort((a, b) => {
    // Sort according to selected sort criteria
    if (sortBy === 'name') return a.sender.fullName.localeCompare(b.sender.fullName);
    if (sortBy === 'username') return a.sender.username.localeCompare(b.sender.username);
    if (sortBy === 'recent') return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  // Card component for grid view
  const RequestCard = ({ request }) => {
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
              src={request.sender.coverImage || 'https://via.placeholder.com/500x200?text=Cover+Image'} 
              className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-105' 
              alt={request.sender.fullName} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-50"></div>
          </div>

          {/* Expand button with animation */}
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedUser(request.sender);
            }}
            whileHover={{ scale: 1.2, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-3 right-3 z-10 bg-white/90 p-2 rounded-full shadow-md backdrop-blur-sm"
          >
            <IoExpandSharp size={16} className="text-blue-600" />
          </motion.button>

          {/* Profile picture with animation */}
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
            <Link href={`profile/${request.sender._id}`}>
              <motion.div
                whileHover={{ scale: 1.08, y: -5 }}
                className="w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-lg group-hover:border-blue-100 transition-all duration-300"
              >
                <img
                  src={request.sender.profilePicture}
                  alt={request.sender.fullName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </motion.div>
            </Link>
          </div>
        </div>

        <div className="pt-14 pb-5 px-5">
          <div className="text-center mb-4">
            <Link href={`profile/${request.sender._id}`} className="group">
              <h3 className="font-bold text-gray-800 text-lg capitalize group-hover:text-blue-600 transition-colors duration-300">{request.sender.fullName}</h3>
            </Link>
            <p className="text-sm text-blue-500 font-medium">@{request.sender.username}</p>
            <div className="mt-2 h-10">
              <p className="text-sm text-gray-600 line-clamp-2 italic bg-gray-50 p-1.5 rounded-lg">{request.sender.bio || "No bio available"}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <Link
              href={`profile/${request.sender._id}`}
              className="w-full py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center justify-center group"
            >
              <FiEye className="mr-2 group-hover:scale-110 transition-transform duration-300" /> 
              <span className="group-hover:translate-x-0.5 transition-transform duration-300">View Profile</span>
            </Link>
            
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow"
                onClick={() => handleAcceptRequest(request._id)}
              >
                <FiCheck className="mr-1.5" /> Accept
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow"
                onClick={() => handleRejectRequest(request._id)}
              >
                <FiX className="mr-1.5" /> Reject
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Status indicator */}
        <div className="absolute top-0 left-0 m-3">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="p-1.5 rounded-full bg-amber-500 shadow-md"
          >
            <FiClock size={12} className="text-white" />
          </motion.div>
        </div>
      </motion.div>
    );
  };

  // List component for list view
  const RequestListItem = ({ request }) => {
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
            <Link href={`profile/${request.sender._id}`}>
              <motion.div
                whileHover={{ scale: 1.12 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-blue-200 transition-all duration-300 group-hover:border-blue-400 shadow-md"
              >
                <img
                  src={request.sender.profilePicture}
                  alt={request.sender.fullName}
                  className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            </Link>
          </div>

          <div className="flex flex-col">
            <Link href={`profile/${request.sender._id}`} className="group">
              <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors text-lg">
                {request.sender.fullName}
              </h3>
            </Link>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-blue-500 font-medium">@{request.sender.username}</p>
              {request.sender.isDpVerify && (
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="text-blue-500 bg-blue-100 p-0.5 rounded-full"
                >
                  <FiCheck size={12} />
                </motion.div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{request.sender.bio || "No bio available"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.15, y: -2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400 }}
            onClick={() => setSelectedUser(request.sender)}
            className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all duration-300"
            aria-label="View details"
          >
            <FiEye size={18} />
          </motion.button>

          <button
            onClick={() => setSelectedUser(request.sender)}
            className="p-2.5 text-blue-500 hover:bg-blue-50 rounded-xl transition-all duration-300 hover:text-blue-700 hover:shadow-sm"
            aria-label="View profile"
          >
            <IoExpandSharp size={18} />
          </button>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center"
              onClick={() => handleAcceptRequest(request._id)}
            >
              <FiCheck className="mr-1.5" size={14} /> Accept
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center"
              onClick={() => handleRejectRequest(request._id)}
            >
              <FiX className="mr-1.5" size={14} /> Reject
            </motion.button>
          </div>
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
                <h1 className="text-2xl font-bold text-gray-800">Pending Requests</h1>
                <p className="text-sm text-gray-500">Manage your friend requests</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative flex-1 md:w-64">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search requests..."
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
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                >
                  <FiFilter size={20} />
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
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Sort By</h3>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: 'name', label: 'Name' },
                          { id: 'username', label: 'Username' },
                          { id: 'recent', label: 'Recently Received' },
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

            {/* Request Count Badge */}
            <div className="mt-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <FiUsers className="mr-1.5" />
                {filteredRequests.length} {filteredRequests.length === 1 ? 'Request' : 'Requests'}
              </span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="container mx-auto px-4 py-6">
          {filteredRequests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-md p-8 text-center max-w-2xl mx-auto"
            >
              <div className="flex justify-center mb-4">
                <FiClock size={48} className="text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Pending Friend Requests</h3>
              <p className="text-gray-600 mb-6">
                You currently have no friend requests waiting for your approval. Connect with others to expand your network!
              </p>
              <Link href="/people" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center mx-auto w-max">
                <FiUsers className="mr-2" /> Find People
              </Link>
            </motion.div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              <AnimatePresence>
                {filteredRequests.map(request => (
                  <motion.div
                    key={request._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    {viewMode === 'grid' ? (
                      <RequestCard request={request} />
                    ) : (
                      <RequestListItem request={request} />
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
                    src={selectedUser.coverImage || 'https://via.placeholder.com/500x200?text=Cover+Image'} 
                    className='h-full w-full object-cover' 
                    alt={selectedUser.fullName}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-all shadow-md"
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
                  </div>

                  <div className="flex justify-center space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center shadow-md"
                      onClick={() => {
                        const request = receivedRequests.find(req => req.sender._id === selectedUser._id);
                        if (request) {
                          handleAcceptRequest(request._id);
                          setSelectedUser(null);
                        }
                      }}
                    >
                      <FiUserCheck className="mr-2" /> Accept Request
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center shadow-md"
                      onClick={() => {
                        const request = receivedRequests.find(req => req.sender._id === selectedUser._id);
                        if (request) {
                          handleRejectRequest(request._id);
                          setSelectedUser(null);
                        }
                      }}
                    >
                      <FiUserX className="mr-2" /> Reject
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

export default PendingRequests;

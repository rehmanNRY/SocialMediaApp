"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { votePollOption, getPollResults } from "@/redux/posts/postsSlice";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiClock, FiBarChart2, FiUsers, FiLock, FiRefreshCw } from "react-icons/fi";

const PollSection = ({ post, isLoggedIn, userDetails }) => {
  const dispatch = useDispatch();
  const [userVote, setUserVote] = useState(null);
  const [pollResults, setPollResults] = useState(null);
  const [isLoadingVote, setIsLoadingVote] = useState(false);
  const [isHovering, setIsHovering] = useState(null);
  const [isChangingVote, setIsChangingVote] = useState(false);

  // Check if user has voted in the poll
  useEffect(() => {
    if (post.poll && post.poll.options && userDetails?._id) {
      for (const option of post.poll.options) {
        if (option.votes.some(vote => vote._id === userDetails._id || vote === userDetails._id)) {
          setUserVote(option._id);
          break;
        }
      }
    }
  }, [post.poll, userDetails]);

  // Fetch poll results when needed
  useEffect(() => {
    if (post.poll && post.poll.options && post._id) {
      dispatch(getPollResults(post._id)).then((action) => {
        if (action.payload) {
          setPollResults(action.payload.data);
        }
      });
    }
  }, [dispatch, post._id, post.poll]);

  const handleVote = (optionId) => {
    if (!isLoggedIn || isLoadingVote) return;

    setIsLoadingVote(true);
    const previousVote = userVote;
    setUserVote(optionId);
    setIsChangingVote(false);

    dispatch(votePollOption({ postId: post._id, optionId }))
      .unwrap()
      .then(() => dispatch(getPollResults(post._id)))
      .then((action) => {
        if (action.payload) setPollResults(action.payload.data);
      })
      .catch((error) => {
        setUserVote(previousVote);
        console.error("Error voting on poll:", error);
      })
      .finally(() => setIsLoadingVote(false));
  };

  const toggleChangeVote = () => setIsChangingVote(!isChangingVote);

  const calculatePollPercentage = (option) => {
    if (!pollResults || !pollResults.totalVotes) return 0;
    const result = pollResults.results.find(r => r._id === option._id);
    return result ? result.percentage : 0;
  };

  const isPollActive = post.poll && post.poll.active;
  const isPollExpired = post.poll && post.poll.endDate && new Date(post.poll.endDate) < new Date();

  const formatRemainingTime = () => {
    if (!post.poll?.endDate) return null;
    const endDate = new Date(post.poll.endDate);
    const now = new Date();
    if (endDate < now) return "Poll ended";
    
    const diffMs = endDate - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays > 1) return `${diffDays} days left`;
    if (diffDays === 1) return "1 day left";
    
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (diffHours > 0) return `${diffHours} hours left`;
    
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffMinutes} minutes left`;
  };

  if (!post.poll || !post.poll.options || post.poll.options.length === 0) {
    return null;
  }

  const canChangeVote = userVote && isPollActive && !isPollExpired && isLoggedIn;
  const canVoteInitially = !userVote && isPollActive && !isPollExpired && !isLoadingVote;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-4 mb-6"
    >
      <motion.div 
        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
        whileHover={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)" }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-800 flex items-center">
            <FiBarChart2 className="mr-2 text-indigo-500" />
            <span>{post.poll.question || "Poll"}</span>
          </h4>
          
          <div className="flex items-center space-x-3">
            {canChangeVote && !isChangingVote && (
              <motion.button
                onClick={toggleChangeVote}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center text-xs font-medium text-indigo-500 hover:text-indigo-600 transition-colors"
              >
                <FiRefreshCw className="mr-1" />
                <span>Change vote</span>
              </motion.button>
            )}
            
            {post.poll.endDate && (
              <motion.div 
                className={`flex items-center text-xs font-medium ${isPollExpired ? "text-red-500" : "text-indigo-500"}`}
              >
                <FiClock className="mr-1" />
                <span>{formatRemainingTime()}</span>
              </motion.div>
            )}
          </div>
        </div>

        <div className="space-y-2.5">
          <AnimatePresence>
            {post.poll.options.map((option, index) => {
              const percentage = calculatePollPercentage(option);
              const isSelected = userVote === option._id;
              const canVote = (canVoteInitially || isChangingVote) && !isLoadingVote;

              return (
                <motion.div 
                  key={option._id} 
                  className="relative"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  onMouseEnter={() => canVote && setIsHovering(option._id)}
                  onMouseLeave={() => setIsHovering(null)}
                >
                  {/* Background progress bar */}
                  <AnimatePresence>
                    {(userVote || !isPollActive || isPollExpired) && !isChangingVote && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className={`absolute top-0 left-0 h-full rounded-lg ${
                          isSelected ? "bg-indigo-100" : "bg-gray-100"
                        } z-0`}
                      />
                    )}
                  </AnimatePresence>

                  {/* Option button */}
                  <motion.button
                    onClick={() => canVote && handleVote(option._id)}
                    disabled={!canVote}
                    className={`w-full text-left p-3.5 rounded-lg border relative z-10 transition-all ${
                      isSelected && !isChangingVote
                        ? "border-indigo-500 text-indigo-700 font-medium"
                        : isHovering === option._id
                        ? "border-indigo-300 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    } ${canVote ? "cursor-pointer" : "cursor-default"}`}
                    whileHover={canVote ? { scale: 1.01 } : {}}
                    whileTap={canVote ? { scale: 0.99 } : {}}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {isSelected && !isChangingVote && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="mr-2 text-indigo-500"
                          >
                            <FiCheckCircle />
                          </motion.div>
                        )}
                        <span>{option.text}</span>
                      </div>
                      
                      {(userVote || !isPollActive || isPollExpired) && !isChangingVote && (
                        <motion.span 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="font-semibold ml-2"
                        >
                          {percentage}%
                        </motion.span>
                      )}
                    </div>
                  </motion.button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Poll metadata */}
        <motion.div 
          className="mt-4 flex justify-between items-center text-xs font-medium text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center">
            <FiUsers className="mr-1" />
            {pollResults?.totalVotes > 0 ? (
              <span>{pollResults.totalVotes} vote{pollResults.totalVotes !== 1 ? 's' : ''}</span>
            ) : (
              <span>No votes yet</span>
            )}
          </div>
          
          {isChangingVote && (
            <motion.button
              onClick={toggleChangeVote}
              className="text-indigo-500 hover:text-indigo-600 transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Cancel
            </motion.button>
          )}
          
          {!isPollActive && !isPollExpired && (
            <div className="flex items-center text-gray-400">
              <FiLock className="mr-1" />
              <span>Poll inactive</span>
            </div>
          )}
        </motion.div>

        {/* Auth prompt */}
        {!isLoggedIn && isPollActive && !isPollExpired && (
          <motion.div 
            className="mt-3 py-2 px-3 bg-indigo-50 text-indigo-700 text-sm rounded-md"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Sign in to vote on this poll
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PollSection;
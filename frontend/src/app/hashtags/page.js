"use client";
import { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/redux/posts/postsSlice";
import AuthRedirect from "@/components/AuthRedirect";
import { FaFire, FaCode, FaLeaf, FaMusic, FaCamera, FaGamepad, FaBook, FaUtensils, FaPlane } from "react-icons/fa";
import { BsHash } from "react-icons/bs";
import PostList from "@/components/feed/posts/PostList";
import { BsFillPostcardFill } from "react-icons/bs";
import RunningServer from "@/components/RunningServer";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loading } from "@/components";

function HomeContent() {
  const dispatch = useDispatch();
  const allPosts = useSelector((state) => state.posts.posts);
  const [isServerRunning, setIsServerRunning] = useState(false);
  const searchParams = useSearchParams();

  // Define hashtags with their icons and colors
  const hashtags = [
    { name: "Trending", icon: <FaFire />, color: "#FF6B6B", bgColor: "#FFE0E0" },
    { name: "Dev", icon: <FaCode />, color: "#4D96FF", bgColor: "#E0EAFF" },
    { name: "Nature", icon: <FaLeaf />, color: "#56C271", bgColor: "#E0FFE5" },
    { name: "Music", icon: <FaMusic />, color: "#9B5DE5", bgColor: "#F0E5FF" },
    { name: "Photography", icon: <FaCamera />, color: "#FF9E6D", bgColor: "#FFEEE0" },
    { name: "Gaming", icon: <FaGamepad />, color: "#FF5E78", bgColor: "#FFE0E5" },
    { name: "Books", icon: <FaBook />, color: "#00C2A8", bgColor: "#E0FFF9" },
    { name: "Food", icon: <FaUtensils />, color: "#FFBD3E", bgColor: "#FFF5E0" },
    { name: "Travel", icon: <FaPlane />, color: "#4D96FF", bgColor: "#E0F1FF" }
  ];

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API}/`);
        if (response.data === "Server is running!") {
          setIsServerRunning(true);
        }
      } catch (error) {
        setIsServerRunning(false);
      }
    };
    checkServer();
  }, []);

  // Get hashtag from URL search params
  const hashtagParam = searchParams.get('hashtag');

  // State to manage selected hashtags and filters
  const [selectedHashtag, setSelectedHashtag] = useState(hashtagParam || "");

  useEffect(() => {
    setSelectedHashtag(hashtagParam || "");
  }, [hashtagParam])


  useEffect(() => {
    if (isServerRunning) {
      dispatch(getAllPosts());
    }
  }, [dispatch, isServerRunning]);

  // Handler for hashtag click
  const handleHashtagClick = (hashtag) => {
    setSelectedHashtag(hashtag === selectedHashtag ? "" : hashtag);
  };

  // Filter posts based on selected hashtag and filters
  const filteredPosts = allPosts.filter((post) => {
    // Filter by hashtag
    const matchesHashtag = selectedHashtag
      ? post.content.toLowerCase().includes(`#${selectedHashtag.toLowerCase()}`)
      : true;
    return matchesHashtag;
  });

  if (!isServerRunning) {
    return <RunningServer />;
  }

  return (
    <AuthRedirect>
      <main className="bg-[#F5F6FA] mx-auto p-4 space-y-6 w-full min-h-screen">
        {/* Hashtag Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-5 mb-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <BsHash className="text-indigo-600 text-3xl" />
            <h1 className="text-2xl font-bold text-gray-800">Trending Hashtags</h1>
          </div>

          {selectedHashtag && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100"
            >
              <p className="text-indigo-700 font-medium flex items-center gap-2">
                <span>Currently viewing:</span>
                <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {hashtags.find(h => h.name === selectedHashtag)?.icon}
                  #{selectedHashtag}
                </span>
              </p>
            </motion.div>
          )}

          {/* Hashtag Cards Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {hashtags.map((tag) => (
              <motion.div
                key={tag.name}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleHashtagClick(tag.name)}
                className={`cursor-pointer rounded-xl p-4 transition-all duration-300 flex items-center gap-3 ${selectedHashtag === tag.name
                  ? `bg-gradient-to-r from-${tag.color.replace('#', '')} to-${tag.color.replace('#', '')}/80 text-white`
                  : `bg-white border hover:border-${tag.color.replace('#', '')}`
                  }`}
                style={{
                  backgroundColor: selectedHashtag === tag.name ? tag.color : 'white',
                  borderColor: tag.color,
                }}
              >
                <div
                  className="p-3 rounded-full"
                  style={{
                    backgroundColor: selectedHashtag === tag.name ? 'rgba(255, 255, 255, 0.2)' : tag.bgColor,
                    color: selectedHashtag === tag.name ? 'white' : tag.color
                  }}
                >
                  {tag.icon}
                </div>
                <div>
                  <p className={`font-semibold ${selectedHashtag === tag.name ? 'text-white' : 'text-gray-800'}`}>
                    #{tag.name}
                  </p>
                  <p className={`text-xs ${selectedHashtag === tag.name ? 'text-white/80' : 'text-gray-500'}`}>
                    Trending posts
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Posts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-3.5 pb-8"
        >
          {filteredPosts.length > 0 ? (
            <PostList posts={filteredPosts} />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-10 bg-white rounded-xl shadow-sm">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <BsFillPostcardFill className="text-gray-300 text-6xl mb-4" />
              </motion.div>
              <p className="text-xl text-gray-500">No posts found</p>
              <p className="text-sm text-gray-400 mt-2">
                {selectedHashtag
                  ? `No posts with #${selectedHashtag} hashtag`
                  : "Try selecting a hashtag to see related posts"}
              </p>
            </div>
          )}
        </motion.div>
      </main>
    </AuthRedirect>
  );
}


export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <HomeContent />
    </Suspense>
  )
}
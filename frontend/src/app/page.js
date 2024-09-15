"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/redux/posts/postsSlice";
import AuthRedirect from "@/components/AuthRedirect";
import { FaFire, FaCode, FaLeaf, FaTree } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import { AiOutlinePlusCircle } from "react-icons/ai";
import PostForm from "@/components/feed/posts/PostForm";
import PostList from "@/components/feed/posts/PostList";

export default function Home() {
  const dispatch = useDispatch();
  const allPosts = useSelector((state) => state.posts.posts);
  
  // State to manage selected hashtags and filters
  const [selectedHashtag, setSelectedHashtag] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  
  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  // Handler for hashtag click
  const handleHashtagClick = (hashtag) => {
    setSelectedHashtag(hashtag);
  };

  // Handler for adding/removing filters
  const handleFilterClick = (filter) => {
    setSelectedFilters((prevFilters) =>
      prevFilters.includes(filter)
        ? prevFilters.filter((f) => f !== filter) // Remove filter if it's already selected
        : [...prevFilters, filter] // Add filter if it's not selected
    );
  };

  // Clear all filters and hashtags
  const clearFilters = () => {
    setSelectedHashtag("");
    setSelectedFilters([]);
  };

  // Filter posts based on selected hashtag and filters
  const filteredPosts = allPosts.filter((post) => {
    // Filter by hashtag
    const matchesHashtag = selectedHashtag
      ? post.content.toLowerCase().includes(`#${selectedHashtag.toLowerCase()}`)
      : true;
      
    // Filter by additional filters (example: posts with images)
    const matchesFilters = selectedFilters.every((filter) => {
      if (filter === "withImages") return post.image !== "";
      if (filter === "liked") return post.likes.length > 0;
      // Add more filter conditions as needed
      return true;
    });

    return matchesHashtag && matchesFilters;
  });

  return (
    <AuthRedirect>
      <main className="bg-[#F5F6FA] mx-auto p-4 space-y-8 w-full">
        {/* Hashtag and Actions Section */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <ul className="flex gap-2 flex-wrap">
            {["Trending", "Dev", "Nature"].map((tag) => (
              <li
                key={tag}
                className={`flex items-center gap-2 border font-semibold text-sm rounded-full px-4 py-1 cursor-pointer transition ${
                  selectedHashtag === tag
                    ? "bg-indigo-300 text-white"
                    : "bg-indigo-100 text-indigo-900 border-indigo-400"
                }`}
                onClick={() => handleHashtagClick(tag)}
              >
                {tag === "Trending" && <FaFire className="text-indigo-900" />}
                {tag === "Dev" && <FaCode className="text-indigo-900" />}
                {tag === "Nature" && <FaLeaf className="text-indigo-900" />}
                #{tag}
              </li>
            ))}
          </ul>
          {/* Additional Actions */}
          <div className="flex items-center gap-2">
            <button
              className={`flex items-center gap-1 text-sm font-semibold px-4 py-1 transition border rounded-full cursor-pointer ${
                selectedFilters.includes("withImages")
                  ? "bg-indigo-300 text-white"
                  : "bg-indigo-100 text-indigo-900 border-indigo-400"
              }`}
              onClick={() => handleFilterClick("withImages")}
            >
              <FiFilter className="text-indigo-900" />
              With Images
            </button>
            <button
              className={`flex items-center gap-1 text-sm font-semibold px-4 py-1 transition border rounded-full cursor-pointer ${
                selectedFilters.includes("liked")
                  ? "bg-indigo-300 text-white"
                  : "bg-indigo-100 text-indigo-900 border-indigo-400"
              }`}
              onClick={() => handleFilterClick("liked")}
            >
              <FiFilter className="text-indigo-900" />
              Liked
            </button>
            <button
              className="flex items-center gap-1 text-sm font-semibold text-indigo-900 bg-indigo-100 border border-indigo-400 rounded-full px-4 py-1 hover:bg-indigo-200 transition"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>

        <PostForm />
        <PostList posts={filteredPosts} />
      </main>
    </AuthRedirect>
  );
}

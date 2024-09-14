// components/Rightbar.js
"use client";
import { useState, useEffect } from "react";
import { FiTrendingUp } from "react-icons/fi";
import { AiOutlineTeam, AiOutlineAppstoreAdd } from "react-icons/ai";
import { BsBriefcase, BsGlobe, BsGear } from "react-icons/bs";
import { MdOutlineAnalytics, MdOutlineHelpCenter } from "react-icons/md";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";

const Rightbar = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [isClient, setIsClient] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, [isLoggedIn]);

  // Hide the Rightbar for specific routes
  const hideOnPaths = ["/settings", "/contact", "/profile"];
  const shouldHideRightbar =
    hideOnPaths.some((path) => pathname.startsWith(path));

  if (!isClient || shouldHideRightbar) {
    return null; // Render nothing until client-side rendering is confirmed or for specified paths
  }

  const recentActivities = [
    { icon: <FiTrendingUp />, title: "Trending Posts", description: "Latest posts trending now." },
    { icon: <BsBriefcase />, title: "Job Alerts", description: "New opportunities in your field." },
    { icon: <AiOutlineTeam />, title: "Networking Events", description: "Upcoming meetups." },
  ];

  const groups = [
    { name: "Developers Hub", members: 1245 },
    { name: "Design Geeks", members: 985 },
    { name: "Product Managers", members: 789 },
  ];

  return (
    <>
      {isLoggedIn && (
        <div className={`w-64`}>
          <div
            className="w-64 p-4 bg-white shadow-lg flex flex-col gap-4 fixed overflow-y-auto"
            style={{ height: "calc(100vh - 4rem)" }}
          >
            {/* Recent Activities */}
            <div className="flex flex-col gap-2.5 border-b py-3">
              <h4 className="text-md font-semibold text-gray-800">
                Recent Activities
              </h4>
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition"
                >
                  {activity.icon}
                  <div>
                    <p className="text-gray-700">{activity.title}</p>
                    <span className="text-xs text-gray-500">
                      {activity.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* Navigation Menu */}
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-md cursor-pointer transition">
                <AiOutlineAppstoreAdd className="text-pink-600" />
                <span className="text-gray-700">Apps</span>
              </li>
              <li className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-md cursor-pointer transition">
                <MdOutlineAnalytics className="text-indigo-600" />
                <span className="text-gray-700">Analytics</span>
              </li>
              <li className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-md cursor-pointer transition">
                <BsGear className="text-gray-600" />
                <span className="text-gray-700">Settings</span>
              </li>
            </ul>

            {/* Suggested Groups */}
            <div className="flex flex-col gap-3 border-t pt-3">
              <h4 className="text-md font-semibold text-gray-800">
                Suggested Groups
              </h4>
              {groups.map((group, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 rounded-md hover:bg-gray-100 transition cursor-pointer"
                >
                  <div>
                    <p className="text-gray-700">{group.name}</p>
                    <span className="text-xs text-gray-500">
                      {group.members} members
                    </span>
                  </div>
                  <button className="text-blue-500 text-xs font-semibold">
                    Join
                  </button>
                </div>
              ))}
              {/* Toggle More Section */}
              {showMore && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition">
                    <BsGlobe className="text-teal-600" />
                    <span className="text-gray-700">
                      Discover New Connections
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition">
                    <MdOutlineHelpCenter className="text-orange-600" />
                    <span className="text-gray-700">Help Center</span>
                  </div>
                </div>
              )}
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
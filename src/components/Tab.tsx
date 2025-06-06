"use client";
import React, { useRef, useLayoutEffect, useEffect } from "react";
import { motion } from "framer-motion";
import { useTabStore, TabType } from "../stores/tabStore";

const tabs = [
  "For You",
  "Following",
  "Trending",
  "Latest",
  "Most Liked",
  "My Blogs",
] as const;

const Tab: React.FC = () => {
  const { activeTab, setActiveTab } = useTabStore();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [underlineStyle, setUnderlineStyle] = React.useState({
    left: 0,
    width: 0,
  });

  useLayoutEffect(() => {
    const index = tabs.indexOf(activeTab);
    const currentTab = tabRefs.current[index];
    if (currentTab && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const tabRect = currentTab.getBoundingClientRect();

      setUnderlineStyle({
        left:
          tabRect.left - containerRect.left + containerRef.current.scrollLeft,
        width: tabRect.width,
      });
    }
  }, [activeTab]);

  useEffect(() => {
    console.log("activeTab changed:", activeTab);
  }, [activeTab]);

  const handleClick = (tab: TabType) => {
    setActiveTab(tab);
  };

  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        className="flex space-x-8 overflow-x-auto pb-4 relative"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {tabs.map((tab, index) => (
          <button
            key={tab}
            ref={(el) => (tabRefs.current[index] = el)}
            onClick={() => handleClick(tab)}
            className={`relative text-sm md:text-base whitespace-nowrap cursor-pointer transition-colors
              ${
                activeTab === tab ? "text-black font-semibold" : "text-gray-500"
              }
            `}
          >
            {tab}
          </button>
        ))}

        <motion.div
          className="absolute bottom-0 h-[2px] bg-purple-600 rounded-full"
          initial={false}
          animate={{
            left: underlineStyle.left,
            width: underlineStyle.width,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>
    </div>
  );
};

export default Tab;

"use client";
import React, { useState, useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";

const tabs = [
  "For You",
  "Following",
  "Trending",
  "Latest",
  "Most Liked",
  "Explore",
] as const;

type TabType = (typeof tabs)[number];

const Tab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("For You");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [underlineProps, setUnderlineProps] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const index = tabs.indexOf(activeTab);
    const currentTab = tabRefs.current[index];

    if (currentTab && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const tabRect = currentTab.getBoundingClientRect();

      const scrollLeft = containerRef.current.scrollLeft;

      setUnderlineProps({
        left: tabRect.left - containerRect.left + scrollLeft,
        width: tabRect.width,
      });
    }
  }, [activeTab]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="flex space-x-8 overflow-x-auto no-scrollbar relative"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab}
            ref={(el) => (tabRefs.current[index] = el)}
            onClick={() => setActiveTab(tab)}
            className={`md:text-base text-sm whitespace-nowrap cursor-pointer font-medium transition-colors duration-300 ${
              activeTab === tab ? "text-purple-600" : "text-gray-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <motion.div
        className="absolute top-8 bottom-0 h-[3px] rounded-full bg-purple-600"
        layout
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        animate={{
          left: underlineProps.left,
          width: underlineProps.width,
        }}
      />
    </div>
  );
};

export default Tab;

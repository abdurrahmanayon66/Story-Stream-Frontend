"use client";
import React, { useState, useRef, useLayoutEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useBlogStore, TabType } from "../stores/blog";
import { usePrefetchBlogs } from "@/hooks/blog";

const tabs = [
  "For You",
  "Following",
  "Trending",
  "Latest",
  "Most Liked",
  "Explore",
] as const;

const Tab: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    getCurrentTabLoading,
    getCurrentTabError,
    clearBlogData,
    resetFilters 
  } = useBlogStore();
  
  const { prefetchTab } = usePrefetchBlogs();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [underlineProps, setUnderlineProps] = useState({ left: 0, width: 0 });
  const [hoveredTab, setHoveredTab] = useState<TabType | null>(null);

  // Update underline position when active tab changes
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

  // Handle tab click with state management
  const handleTabClick = useCallback((tab: TabType) => {
    if (tab === activeTab) return;

    // Set active tab (this will trigger blog fetching in BlogsSection)
    setActiveTab(tab);

    // Optional: Clear filters when switching tabs
    // resetFilters();
  }, [activeTab, setActiveTab]);

  // Handle tab hover for prefetching
  const handleTabHover = useCallback((tab: TabType) => {
    if (tab !== activeTab && tab !== hoveredTab) {
      setHoveredTab(tab);
      // Prefetch blogs for the hovered tab
      prefetchTab(tab);
    }
  }, [activeTab, hoveredTab, prefetchTab]);

  const handleTabLeave = useCallback(() => {
    setHoveredTab(null);
  }, []);

  // Get tab loading state
  const getTabLoadingState = (tab: TabType) => {
    return getCurrentTabLoading() && activeTab === tab;
  };

  // Get tab error state
  const getTabErrorState = (tab: TabType) => {
    return getCurrentTabError() && activeTab === tab;
  };

  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        className="flex space-x-8 overflow-x-auto scrollbar-hide relative pb-4"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab;
          const isLoading = getTabLoadingState(tab);
          const hasError = getTabErrorState(tab);
          
          return (
            <button
              key={tab}
              ref={(el) => (tabRefs.current[index] = el)}
              onClick={() => handleTabClick(tab)}
              onMouseEnter={() => handleTabHover(tab)}
              onMouseLeave={handleTabLeave}
              disabled={isLoading}
              className={`
                relative md:text-base text-sm whitespace-nowrap cursor-pointer 
                font-medium transition-all duration-300 py-2 px-1
                hover:text-purple-600 disabled:cursor-not-allowed
                ${isActive 
                  ? "text-purple-600 font-semibold" 
                  : hasError 
                    ? "text-red-500 hover:text-red-600" 
                    : "text-gray-800 hover:text-purple-500"
                }
                ${isLoading ? "opacity-60" : "opacity-100"}
              `}
              aria-current={isActive ? "page" : undefined}
              title={hasError ? "Failed to load content" : undefined}
            >
              <span className="flex items-center gap-2">
                {tab}
                
                {/* Loading indicator */}
                {isLoading && (
                  <svg 
                    className="animate-spin h-3 w-3 text-current" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                
                {/* Error indicator */}
                {hasError && !isLoading && (
                  <svg 
                    className="h-3 w-3 text-red-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                    />
                  </svg>
                )}
              </span>

              {/* Hover effect background */}
              {hoveredTab === tab && !isActive && (
                <motion.div
                  className="absolute inset-0 bg-purple-50 rounded-md -z-10"
                  layoutId="tabHover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Active tab underline */}
      <motion.div
        className="absolute bottom-0 h-[3px] rounded-full bg-gradient-to-r from-purple-600 to-purple-500 shadow-sm"
        layout
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 30,
          mass: 0.8
        }}
        animate={{
          left: underlineProps.left,
          width: underlineProps.width,
        }}
        style={{
          boxShadow: '0 0 8px rgba(147, 51, 234, 0.3)',
        }}
      />

      {/* Tab content hint */}
      <div className="mt-2 text-xs text-gray-500 text-center">
        {activeTab === 'For You' && "Personalized content based on your interests"}
        {activeTab === 'Following' && "Latest posts from people you follow"}
        {activeTab === 'Trending' && "Popular content trending right now"}
        {activeTab === 'Latest' && "Most recent blog posts"}
        {activeTab === 'Most Liked' && "Highly appreciated content"}
        {activeTab === 'Explore' && "Discover new and diverse content"}
      </div>
    </div>
  );
};

export default Tab;
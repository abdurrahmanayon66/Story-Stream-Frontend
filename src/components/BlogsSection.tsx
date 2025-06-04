import React, { useEffect } from "react";
import { useBlogStore } from "../stores/blog";
import { useBlogs, usePrefetchBlogs } from "../hooks/blog";
import BlogCard from "./BlogCard";
import Pagination from "./Pagination";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

const BlogsSection: React.FC = () => {
  const {
    activeTab,
    currentPage,
    getCurrentTabData,
    getCurrentTabLoading,
    getCurrentTabError,
    setCurrentPage,
  } = useBlogStore();

  const { prefetchTab } = usePrefetchBlogs();

  // Fetch blogs for current tab
  const {
    data: blogData,
    isLoading,
    isError,
    error,
    refetch,
  } = useBlogs({
    keepPreviousData: true, // Keep showing old data while fetching new
    refetchOnMount: false,  // Don't refetch if data exists
  });

  // Get data from store (for immediate UI updates)
  const currentTabData = getCurrentTabData();
  const currentTabLoading = getCurrentTabLoading();
  const currentTabError = getCurrentTabError();

  // Use React Query data if available, fallback to store data
  const blogs = blogData?.blogs || currentTabData?.blogs || [];
  const pagination = blogData?.pagination || currentTabData?.pagination;
  const loading = isLoading || currentTabLoading;
  const errorState = error || currentTabError;

  // Prefetch next tab when user hovers over tab buttons
  const handleTabHover = (tab: string) => {
    if (tab !== activeTab) {
      prefetchTab(tab as any);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Prefetch adjacent pages
  useEffect(() => {
    if (pagination) {
      if (pagination.hasNextPage) {
        // Prefetch next page in background
        setTimeout(() => {
          const nextPageData = { ...useBlogStore.getState(), currentPage: currentPage + 1 };
          // This would trigger a background fetch
        }, 1000);
      }
    }
  }, [currentPage, pagination]);

  if (loading && blogs.length === 0) {
    return (
      <div className="flex flex-col gap-y-6">
        <LoadingSpinner message="Loading blogs..." />
      </div>
    );
  }

  if (errorState && blogs.length === 0) {
    return (
      <div className="flex flex-col gap-y-6">
        <ErrorMessage 
          message={errorState} 
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="flex flex-col gap-y-6">
        <EmptyState activeTab={activeTab} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-6">
      {/* Loading indicator for page changes */}
      {loading && blogs.length > 0 && (
        <div className="text-center py-2">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg">
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading {activeTab.toLowerCase()} blogs...
          </div>
        </div>
      )}

      {/* Blog Cards */}
      <div className={`transition-opacity duration-200 ${loading ? 'opacity-60' : 'opacity-100'}`}>
        {blogs.map((blog) => (
          <BlogCard 
            key={blog.id} 
            blog={blog}
            onTabHover={handleTabHover}
          />
        ))}
      </div>

      {/* Error message for failed updates */}
      {errorState && blogs.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          <p className="text-sm">
            Failed to load latest content: {errorState}
            <button 
              onClick={() => refetch()}
              className="ml-2 text-red-700 underline hover:no-underline"
            >
              Retry
            </button>
          </p>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="w-full flex justify-center">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            maxVisiblePages={5}
            hasNextPage={pagination.hasNextPage}
            hasPreviousPage={pagination.hasPreviousPage}
          />
        </div>
      )}

      {/* Load more button for infinite scroll alternative */}
      {pagination && pagination.hasNextPage && (
        <div className="w-full flex justify-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={loading}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? 'Loading...' : 'Load More Blogs'}
          </button>
        </div>
      )}
    </div>
  );
};

// Empty state component
const EmptyState: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const getEmptyMessage = () => {
    switch (activeTab) {
      case 'Following':
        return {
          title: 'No blogs from people you follow',
          description: 'Start following some authors to see their latest blogs here.',
          action: 'Explore Authors'
        };
      case 'For You':
        return {
          title: 'No personalized content yet',
          description: 'Like and interact with blogs to get personalized recommendations.',
          action: 'Explore Trending'
        };
      default:
        return {
          title: `No ${activeTab.toLowerCase()} blogs found`,
          description: 'Check back later for new content or try a different category.',
          action: 'Refresh'
        };
    }
  };

  const { title, description, action } = getEmptyMessage();

  return (
    <div className="text-center py-12">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200">
          {action}
        </button>
      </div>
    </div>
  );
};

export default BlogsSection;
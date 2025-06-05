import React from "react";
import { useBlogs } from "../hooks/blogHooks";
import BlogCard from "./BlogCard";

const BlogsSection: React.FC = () => {
  const {
    data: blogs = [],
    isLoading,
    error,
    refetch,
  } = useBlogs();

  return (
    <div className="flex flex-col gap-y-6">
      {isLoading && blogs.length > 0 && (
        <div className="text-center py-2">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg">
            <svg
              className="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-600"
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
            Loading blogs...
          </div>
        </div>
      )}

      <div
        className={`transition-opacity space-y-8 duration-200 ${
          isLoading ? "opacity-60" : "opacity-100"
        }`}
      >
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>

      {!isLoading && blogs.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-gray-600">No blogs available at the moment.</p>
        </div>
      )}

      {error && blogs.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          <p className="text-sm">
            Failed to load content: {String(error)}
            <button
              onClick={() => refetch()}
              className="ml-2 text-red-700 underline hover:no-underline"
            >
              Retry
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default BlogsSection;

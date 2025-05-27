import React from "react";
import BlogCard from "./BlogCard";
import Pagination from "./Pagination";

const BlogsSection = () => {
  return (
    <div className="flex flex-col gap-y-6">
      <BlogCard />
      <BlogCard />
      <BlogCard />
      <BlogCard />
      <div className="w-full flex justify-center">
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={2}
          maxVisiblePages={5}
        />
      </div>
    </div>
  );
};

export default BlogsSection;

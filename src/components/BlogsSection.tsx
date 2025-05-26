import React from "react";
import BlogCard from "./BlogCard";

const BlogsSection = () => {
  return (
    <div className="flex flex-col gap-y-6">
      <BlogCard />
      <BlogCard />
      <BlogCard />
      <BlogCard />
    </div>
  );
};

export default BlogsSection;

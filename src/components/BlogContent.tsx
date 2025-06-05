"use client";
import React from "react";
import Image from "next/image";
import Tag from "./Tag";
import { usePathname } from "next/navigation";
import { useBlog } from "../hooks/blogHooks";
import { formatDate } from "../utils/dateFormat";

const BlogContent = () => {
  const pathname = usePathname();
  const blogId = parseInt(pathname?.split("/")[2]);

  const { data: blog, isLoading, isError } = useBlog(blogId);

  if (blog) {
    console.log("Blog: ", blog);
  }

  if (isLoading) return <p>Loading blog...</p>;
  if (isError || !blog) return <p>Failed to load blog.</p>;

  return (
    <div className="bg-white px-4 py-4 rounded-lg">
      <div>
        <Image
          src={`data:image/jpeg;base64,${blog?.image}`}
          alt={blog?.title}
          width={400}
          height={400}
          className="md:w-full md:h-full md:max-h-[400px] object-cover rounded-md"
        />
      </div>

      <section className="text-gray-800 space-y-4 my-4">
        <h1 className="text-3xl font-bold">{blog?.title}</h1>
        <div className="flex gap-x-2 flex-wrap">
          {blog.genre.map((g: string, index: number) => (
            <Tag key={index} label={g} />
          ))}
        </div>
        <div className="flex gap-x-2 items-center text-sm">
          <Image
            src={
              blog?.author?.image
                ? `data:image/jpeg;base64,${blog.author.image}`
                : blog?.author?.profileImage || "https://github.com/shadcn.png"
            }
            alt={blog?.author?.username}
            width={40}
            height={40}
            className="md:w-[30px] md:h-[30px] object-cover rounded-full"
          />
          <span className="text-gray-800">{blog.author.fullName}</span>
          <span className="ml-2 text-gray-800">
            {formatDate(blog?.createdAt)}
          </span>
        </div>
      </section>

      <section className="my-6 space-y-6">
        <h1 className="text-2xl font-bold">{blog?.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: blog?.content}} />
      </section>
    </div>
  );
};

export default BlogContent;

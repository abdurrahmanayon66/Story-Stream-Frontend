import React, { useState } from "react";
import Image from "next/image";
import { CiHeart, CiBookmark, CiChat1 } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import Tag from "./Tag";
import { useRouter } from "next/navigation";
import { formatDate } from "../utils/dateFormat";
import { Blog } from "@/types/blogType";
import useToggleLike from "../hooks/likehooks";

const BlogCard = ({ blog }: { blog: Blog }) => {
  const router = useRouter();

  // Local state to manage like status and count
  const [hasLiked, setHasLiked] = useState(blog?.hasLiked || false);
  const [likesCount, setLikesCount] = useState(blog?.likesCount || 0);

  const toggleLikeMutation = useToggleLike();

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking like button

    // Optimistically update UI
    const newHasLiked = !hasLiked;
    setHasLiked(newHasLiked);
    setLikesCount((prev) => (newHasLiked ? prev + 1 : prev - 1));

    // Call the mutation
    toggleLikeMutation.mutate(
      { blogId: blog.id },
      {
        onError: () => {
          setHasLiked(hasLiked);
          setLikesCount((prev) => (hasLiked ? prev + 1 : prev - 1));
          console.error("Failed to toggle like");
        },
      }
    );
  };

  return (
    <div className="bg-white rounded-2xl text-gray-800 p-6 space-y-4 shadow-sm">
      <section
        className="grid grid-cols-12 hover:cursor-pointer"
        onClick={() => router.push(`/blogs/${blog?.id}/${blog?.slug}`)}
      >
        <div className="col-span-9 grid grid-rows gap-y-4">
          <h1 className="text-2xl font-bold">{blog?.title}</h1>
          <div className="flex gap-x-3">
            <div>
              <Image
                src={
                  blog?.author?.image
                    ? `data:image/jpeg;base64,${blog.author.image}`
                    : blog?.author?.profileImage ||
                      "https://github.com/shadcn.png"
                }
                alt={blog?.author?.username}
                width={80}
                height={80}
                className="md:w-[40px] md:h-[40px] object-cover rounded-full"
              />
            </div>
            <div className="grid grid-rows-2 text-sm">
              <span className="text-gray-700 font-medium">
                {blog?.author?.username}
              </span>
              <span className="text-gray-700">
                {formatDate(blog?.createdAt)}
              </span>
            </div>
          </div>
          <div className="flex gap-x-2 flex-wrap">
            {blog?.genre?.map((genre: string, index: number) => (
              <Tag key={index} label={genre} />
            ))}
          </div>
        </div>
        <div className="col-span-3 flex justify-end">
          <Image
            src={
              blog?.image
                ? `data:image/jpeg;base64,${blog.image}`
                : "https://github.com/shadcn.png"
            }
            alt={blog?.title}
            width={100}
            height={100}
            className="md:w-[100px] md:h-[100px] object-cover rounded-2xl"
          />
        </div>
      </section>
      <section className="flex justify-between w-full text-sm font-medium text-gray-700">
        <div className="flex gap-x-4">
          <div className="flex items-center gap-x-1">
            <CiChat1 className="text-base" />
            <span>{blog?.commentsCount || 0}</span>
          </div>
          <div
            className="flex items-center gap-x-1 cursor-pointer hover:opacity-70 transition-opacity"
            onClick={handleLikeClick}
          >
            {hasLiked ? (
              <FaHeart className="text-base text-red-500" />
            ) : (
              <CiHeart className="text-base" />
            )}
            <span className={hasLiked ? "text-red-500" : ""}>{likesCount}</span>
          </div>
        </div>
        <div>
          <div className="text-base font-medium">
            <CiBookmark />
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogCard;

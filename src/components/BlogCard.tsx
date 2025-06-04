import React from "react";
import Image from "next/image";
import { CiHeart, CiBookmark, CiChat1 } from "react-icons/ci";
import Tag from "./Tag";
import { useRouter } from "next/navigation";

const BlogCard = ({ blog }) => {
  const router = useRouter();
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div
      className="bg-white rounded-2xl text-gray-800 p-6 space-y-4 shadow-sm"
      onClick={() => router.push(`/blogs/${blog?.id}/${blog?.slug}`)}
    >
      <section className="grid grid-cols-12">
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
                {blog?.createdAt ? formatDate(blog.createdAt) : ""}
              </span>
            </div>
          </div>
          <div className="flex gap-x-2 flex-wrap">
            {blog?.genre?.map((genre, index) => (
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
            <CiChat1 className="text-base" />{" "}
            <span>{blog?.commentCount || 0}</span>
          </div>
          <div className="flex items-center gap-x-1">
            <CiHeart className="text-base" />{" "}
            <span>{blog?.likeCount || 0}</span>
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

import { useAuthorByBlogId } from "@/hooks/blogHooks";
import { BlogId } from "@/types/blogId";
import Image from "next/image";
import React from "react";

const AuthorInfo: React.FC<BlogId> = ({ blogId }) => {
  const { data, isLoading, isError } = useAuthorByBlogId(blogId);

  console.log(data);

  return (
    <div>
      <h1 className="text-gray-800 font-bold">Author</h1>
      <div className="my-4">
        <div className="flex gap-x-3 items-start">
          <div className="w-10 h-10 flex-shrink-0">
            <Image
              src={
                data?.image || data?.profileImage || "https://github.com/shadcn.png"
              }
              alt={data?.username || "user image"}
              width={40}
              height={40}
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <div className="flex-1 flex flex-col">
           <div className="relative">
             <span className="text-base font-medium text-gray-800">{data?.fullName}</span>
             <button className="absolute top-0 right-0 bg-customPurple text-white px-4 py-1 rounded-full text-sm">Follow</button>
           </div>
            <span className="text-xs text-gray-500 font-medium">{data?.followerCount} followers · {data?.followingCount} following</span>
            <p className="mt-1 text-gray-500 text-sm line-clamp-5">
             {data?.userBio}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorInfo;

import React from "react";
import Image from "next/image";
import { useFollowerSuggestions } from "../hooks/userHooks";
import { User } from "@/types/userType";

const Followers = () => {
  const { data: suggestions, isLoading, error } = useFollowerSuggestions();

  if (isLoading) {
    return (
      <div>
        <h1 className="text-gray-800 font-bold">Who to follow</h1>
        <div className="grid grid-rows gap-y-4 my-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-between w-full">
              <div className="flex gap-x-2 items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="space-y-2">
                  <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-16 h-2 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="w-16 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-gray-800 font-bold">Who to follow</h1>
        <p className="text-red-500 text-sm mt-2">Error loading suggestions</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-gray-800 font-bold">Who to follow</h1>
      <div className="grid grid-rows gap-y-4 my-4">
        {suggestions?.map((user: User) => (
          <div key={user.id} className="flex justify-between w-full">
            <div className="flex gap-x-2 items-center">
              <div>
                <Image
                  src={
                    user?.image
                      ? `data:image/jpeg;base64,${user?.image}`
                      : user?.profileImage ||
                        "https://github.com/shadcn.png"
                  }
                  alt={user?.username}
                  width={40}
                  height={40}
                  className="md:w-[40px] md:h-[40px] object-cover rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = "https://github.com/shadcn.png";
                  }}
                />
              </div>
              <div className="">
                <h2 className="text-sm text-gray-800 font-medium line-clamp-1">
                  {user?.fullName}
                </h2>
                <h3 className="text-xs text-gray-600 font-light line-clamp-1">
                  @{user?.username}
                </h3>
              </div>
            </div>
            <div>
              <button
                className={`px-2 py-1 rounded-lg text-sm ${
                  user?.isFollowing
                    ? "bg-gray-200 text-gray-800"
                    : "bg-customPurple text-white"
                }`}
              >
                {user?.isFollowing ? "Following" : "Follow"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Followers;

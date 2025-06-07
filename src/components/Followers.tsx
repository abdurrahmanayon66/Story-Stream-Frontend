import React, { useEffect, useState, useRef} from "react";
import Image from "next/image";
import { useInfiniteFollowerSuggestions, useToggleFollow } from "../hooks/followHooks";
import { User } from "@/types/userType";

const Followers = () => {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteFollowerSuggestions();
  
  const toggleFollowMutation = useToggleFollow();
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Flatten the paginated data
  useEffect(() => {
    if (data) {
      const allSuggestions = data.pages.flat();
      console.log("allSuggestions", allSuggestions);
      setSuggestions(allSuggestions);
    }
  }, [data]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!sentinelRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage && !isLoading) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '20px'
      }
    );
    
    observer.observe(sentinelRef.current);
    
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, isLoading, fetchNextPage]);

  const handleFollowClick = (userId: number) => {
    setSuggestions((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, isFollowing: !user.isFollowing }
          : user
      )
    );

    const originalStatus = suggestions.find((user) => user.id === userId)?.isFollowing;

    toggleFollowMutation.mutate(
      { followerId: userId },
      {
        onError: () => {
          // Revert the UI on error
          setSuggestions((prev) =>
            prev.map((user) =>
              user.id === userId
                ? { ...user, isFollowing: originalStatus }
                : user
            )
          );
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="text-gray-800 font-bold">Who to follow</h1>
        <div className="grid grid-rows gap-y-4 my-4">
          {[...Array(5)].map((_, i) => (
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
      <div className="grid grid-rows gap-y-4 my-4 max-h-[220px] overflow-y-scroll">
        {suggestions?.map((user, index) => {
          return (
            <div
              key={user.id}
              className="flex justify-between w-full"
            >
              <div className="flex gap-x-2 items-center">
                <Image
                  src={
                    user?.image
                      ? `data:image/jpeg;base64,${user?.image}`
                      : user?.profileImage || "https://github.com/shadcn.png"
                  }
                  alt={user?.username}
                  width={40}
                  height={40}
                  className="md:w-[40px] md:h-[40px] object-cover rounded-full"
                />
                <div>
                  <h2 className="text-sm text-gray-800 font-medium line-clamp-1">
                    {user.fullName}
                  </h2>
                  <h3 className="text-xs text-gray-600 font-light line-clamp-1">
                    @{user?.username}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => handleFollowClick(user?.id)}
                className={`px-2 py-1 rounded-lg text-sm ${
                  user.isFollowing
                    ? "bg-gray-200 text-gray-800"
                    : "bg-customPurple text-white"
                }`}
              >
                {user.isFollowing ? "Following" : "Follow"}
              </button>
            </div>
          );
        })}
        
        {/* Sentinel element for infinite scroll detection */}
        {hasNextPage && (
          <div ref={sentinelRef} className="h-1 w-full" />
        )}
        
        {/* Loading spinner for next page */}
        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-customPurple border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-gray-600">Loading more...</span>
            </div>
          </div>
        )}
        
        {/* No more data message */}
        {!hasNextPage && suggestions.length > 0 && (
          <div className="text-center py-4">
            <span className="text-sm text-gray-500">No more suggestions</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Followers;
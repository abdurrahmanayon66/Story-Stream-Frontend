import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  PiChatCircleLight,
  PiDotsThreeOutlineFill,
  PiHeartStraight,
} from "react-icons/pi";
import { Comment } from "@/types/commentType";
import { formatDate } from "@/utils/dateFormat";

const CommentCard: React.FC<{ comment: Comment }> = ({ comment }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setShowTooltip(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-2 max-w-[700px]">
      <section>
        <div className="flex gap-x-3 relative">
          <div className="absolute top-0 right-0">
            <button
              onClick={() => setShowTooltip((prev) => !prev)}
              type="button"
              className="p-1 rounded-full hover:bg-gray-200"
            >
              <PiDotsThreeOutlineFill />
            </button>

            <div
              ref={tooltipRef}
              className={`absolute z-10 mt-2 inline-block text-sm font-medium shadow-lg text-white bg-pink-500 rounded-lg transition-opacity duration-200 ${
                showTooltip ? "visible opacity-100" : "invisible opacity-0"
              } px-3 py-2 top-5 left-[-20]`}
            >
              <button className="font-semibold">Delete</button>
              <div
                className="absolute tooltip-arrow left-7 -top-1 w-2 h-2 bg-pink-500 rotate-45"
                data-popper-arrow
              ></div>
            </div>
          </div>

          <div>
            <Image
              src={
                comment?.user?.image
                  ? `data:image/jpeg;base64,${comment?.user?.image}`
                  : comment?.user?.profileImage ||
                    "https://github.com/shadcn.png"
              }
              alt={comment?.user?.username || "user image"}
              width={80}
              height={80}
              className="md:w-[40px] md:h-[40px] object-cover rounded-full"
            />
          </div>

          <div className="grid grid-rows-2 text-sm">
            <span className="text-gray-700 font-medium">
              @{comment?.user?.username}
            </span>
            <span className="text-gray-700 text-xs">
              {formatDate(comment?.createdAt)}
            </span>
          </div>
        </div>
      </section>

      <section>
        <p>{comment?.content}</p>
      </section>

      <section className="flex gap-x-6 text-gray-500 text-sm mt-4">
        <div className="flex gap-x-1 items-center">
          <span className="hover:cursor-pointer">
            <PiHeartStraight />
          </span>
          <span>{comment?.likeCount}</span>
        </div>
        <div className="flex gap-x-1 items-center hover:cursor-pointer">
          <span>
            <PiChatCircleLight />
          </span>
          <span>{comment?.replyCount} replies</span>
        </div>
        <div>
          <button className="text-gray-800 hover:cursor-pointer">Reply</button>
        </div>
      </section>
    </div>
  );
};

export default CommentCard;

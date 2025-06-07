import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  PiChatCircleLight,
  PiDotsThreeOutlineFill,
  PiHeartStraight,
} from "react-icons/pi";

const CommentCard = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Close tooltip on outside click
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
          {/* Three dots + Tooltip */}
          <div className="absolute top-0 right-0">
            <button
              onClick={() => setShowTooltip((prev) => !prev)}
              type="button"
              className="p-1 rounded-full hover:bg-gray-200"
            >
              <PiDotsThreeOutlineFill />
            </button>

            {/* Tooltip container */}
            <div
              ref={tooltipRef}
              className={`absolute z-10 mt-2 inline-block text-sm font-medium shadow-lg text-white bg-pink-500 rounded-lg transition-opacity duration-200 ${
                showTooltip ? "visible opacity-100" : "invisible opacity-0"
              } px-3 py-2 top-5 left-[-20]`}
            >
              <button className="font-semibold">
                Delete
              </button>
              {/* Tooltip arrow */}
              <div
                className="absolute tooltip-arrow left-7 -top-1 w-2 h-2 bg-pink-500 rotate-45"
                data-popper-arrow
              ></div>
            </div>
          </div>

          {/* Avatar */}
          <div>
            <Image
              src="https://github.com/shadcn.png"
              alt="avatar"
              width={80}
              height={80}
              className="md:w-[40px] md:h-[40px] object-cover rounded-full"
            />
          </div>

          {/* Author Info */}
          <div className="grid grid-rows-2 text-sm">
            <span className="text-gray-700 font-medium">Abdur Rahman Ayon</span>
            <span className="text-gray-700 text-xs">2 days ago</span>
          </div>
        </div>
      </section>

      {/* Comment content */}
      <section>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae fuga
          soluta...
        </p>
      </section>

      {/* Footer icons */}
      <section className="flex gap-x-6 text-gray-500 text-sm mt-4">
        <div className="flex gap-x-1 items-center">
          <span className="hover:cursor-pointer"><PiHeartStraight /></span>
          <span>2</span>
        </div>
        <div className="flex gap-x-1 items-center hover:cursor-pointer">
          <span><PiChatCircleLight /></span>
          <span>3 replies</span>
        </div>
        <div>
          <button className="text-gray-800 hover:cursor-pointer">Reply</button>
        </div>
      </section>
    </div>
  );
};

export default CommentCard;

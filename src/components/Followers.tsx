import React from "react";
import Image from "next/image";

const Followers = () => {
  return (
    <div>
      <h1 className="text-gray-800 font-bold">Who to follow</h1>
      <div className="grid grid-rows gap-y-4 my-4">
        <div className="flex justify-between w-full">
          <div className="flex gap-x-2 items-center">
            <div>
              <Image
                src="https://github.com/shadcn.png"
                alt="blog image"
                width={40}
                height={40}
                className="md:w-[40px] md:h-[40px] object-cover rounded-full"
              />
            </div>
            <div className="">
              <h2 className="text-sm text-gray-800 font-medium line-clamp-1">Shadcn</h2>
              <h3 className="text-xs text-gray-600 font-light line-clamp-1">@shadcn</h3>
            </div>
          </div>
          <div>
            <button className="bg-customPurple text-white px-2 py-1 rounded-lg text-sm">Follow</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Followers;

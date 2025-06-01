import React from "react";
import Image from "next/image";
import { CiHeart, CiBookmark, CiChat1 } from "react-icons/ci";
import Tag from "./Tag";

const BlogCard = () => {
  return (
    <div  className="bg-white rounded-2xl text-gray-800 p-6 space-y-4 shadow-sm">
      <section className="grid grid-cols-12">
        <div className="col-span-9 grid grid-rows gap-y-4">
          <h1 className="text-xl font-bold">
            Building a modern application with react and next.js 
          </h1>
          <div className="flex gap-x-3">
            <div>
              <Image
                src="https://github.com/shadcn.png"
                alt="blog image"
                width={40}
                height={40}
                className="md:w-[40px] md:h-[40px] object-cover rounded-full"
              />
            </div>
            <div className="grid grid-rows-2 font-medium text-sm">
              <span className="text-gray-700">Shadcn</span>
              <span className="text-gray-700">3 days ago</span>
            </div>
          </div>
          <div className="flex gap-x-2 flex-wrap">
          <Tag label={"React"} />
          </div>
        </div>
        <div className="col-span-3 flex justify-end">
          <Image
            src="https://github.com/shadcn.png"
            alt="blog image"
            width={100}
            height={100}
            className="md:w-[100px] md:h-[100px] object-cover rounded-2xl"
          />
        </div>
      </section>
      <section className="flex justify-between w-full text-sm font-medium text-gray-700">
        <div className="flex gap-x-4">
          <div className="flex items-center gap-x-1"><CiChat1 className="text-base"  /> <span>502</span></div>
          <div className="flex items-center gap-x-1"><CiHeart className="text-base" /> <span>502</span></div>
        </div>
        <div>
          <div className="text-base font-medium"><CiBookmark /></div>
        </div>
      </section>
    </div>
  );
};

export default BlogCard;

import React from "react";
import Image from "next/image";

const BlogCard = () => {
  return (
    <div>
      <section className="grid grid-cols-12 p-6 bg-white rounded-2xl">
        <div className="col-span-9 grid grid-rows">
          <h1 className="text-xl font-semibold">
            Building a modern application with react
          </h1>
          <div className="grid grid-cols-2">
            <div>
              <Image
                src="https://github.com/shadcn.png"
                alt="blog image"
                width={40}
                height={40}
                className="md:w-[40px] md:h-[40px] object-cover rounded-full"
              />
            </div>
            <div className="grid grid-rows-2">
              <span className="text-slate-500 text-sm">Shadcn</span>
              <span className="text-slate-500 text-sm">3 days ago</span>
            </div>
          </div>
          <div className="space-x-2">
            <span className="bg-lightPurple text-mediumPurple p-2 text-sm rounded-md">
              React
            </span>
            <span className="bg-lightPurple text-mediumPurple p-2 text-sm rounded-md">
              Web Development
            </span>
            <span className="bg-lightPurple text-mediumPurple p-2 text-sm rounded-md">
              education
            </span>
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
      <section></section>
    </div>
  );
};

export default BlogCard;

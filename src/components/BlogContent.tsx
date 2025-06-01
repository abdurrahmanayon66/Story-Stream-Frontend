import React from "react";
import Image from "next/image";
import Tag from "./Tag";

const BlogContent = () => {
  return (
    <div className="bg-white px-4 py-4 rounded-lg">
      <div>
        <Image
          src="https://github.com/shadcn.png"
          alt="blog image"
          width={400}
          height={400}
          className="md:w-full md:h-full md:max-h-[400px] object-cover rounded-md"
        />
      </div>
      <section className="text-gray-800 space-y-4 my-4">
        <h1 className="text-3xl font-bold">
          Building a modern application with react and next.js
        </h1>
        <div className="flex gap-x-2 flex-wrap">
          <Tag label={"React"} />
          <Tag label={"React"} />
          <Tag label={"React"} />
        </div>
        <div className="flex gap-x-2 items-center text-sm">
          <Image
            src="https://github.com/shadcn.png"
            alt="blog image"
            width={40}
            height={40}
            className="md:w-[30px] md:h-[30px] object-cover rounded-full"
          />
          <span>Abdur Rahman Ayon</span>
          <span className="ml-2">Dec 15, 2024</span>
        </div>
      </section>
      <section className="my-6">
        <h1 className="text-2xl font-bold">Introduction</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, quod
          accusantium. Quisquam, quia. Quas, quod accusantium. Quisquam, quia.
        </p>
      </section>
    </div>
  );
};

export default BlogContent;

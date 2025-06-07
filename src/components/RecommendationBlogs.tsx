import Image from "next/image";
import React from "react";
import { CiBookmark, CiChat1, CiHeart } from "react-icons/ci";

const RecommendationBlogs = ({ blogId }) => {
  return (
    <div>
      <h1 className="text-gray-800 font-bold">Who to follow</h1>
      <div className="my-4">
        <div className="w-full space-y-4">
            <div>
              <Image
                src="https://github.com/shadcn.png"
                alt="blog image"
                width={403}
                height={400}
                className="md:w-full md:h-[150px] object-cover rounded-md"
              />
            </div>
            <section>
              <div>
                <h2 className="text-lg text-gray-800 font-bold line-clamp-2">
                  Building a modern application with react and next.js
                </h2>
                <h3 className="text-sm text-gray-600 line-clamp-2">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro
                  provident ullam est unde quae velit sint eveniet, modi
                  mollitia reprehenderit dolore quibusdam fugiat at repellat!
                  Iusto quis reprehenderit reiciendis alias!
                </h3>
              </div>
            </section>
          <section className="flex justify-between items-center w-full text-sm font-medium text-gray-700">
            <div className="flex gap-x-4">
              <div className="flex items-center gap-x-1">
                <CiChat1 className="text-base" /> <span>502</span>
              </div>
              <div className="flex items-center gap-x-1">
                <CiHeart className="text-base" /> <span>502</span>
              </div>
            </div>
            <div>
              <div className="flex itemse-center text-base font-medium">
                <CiBookmark />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RecommendationBlogs;

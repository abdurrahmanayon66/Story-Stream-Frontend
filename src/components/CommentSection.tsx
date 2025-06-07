import Image from "next/image";
import React from "react";
import CommentInputField from "./CommentInputField";
import { BlogId } from "@/types/blogId";
import CommentCard from "./CommentCard";

const CommentSection:React.FC<BlogId> = ({ blogId }) => {
  return (
    <div className="text-gray-800 ">
      <h1 className="font-semibold text-xl mt-16 mb-8">Comments (40)</h1>
      <div className="flex gap-x-2 items-center mb-4">
        <Image
          src={"https://github.com/shadcn.png"}
          alt="author"
          width={100}
          height={100}
          className="w-9 h-9 object-cover rounded-full"
        />
        <span className="font-medium">Abdur Rahman Ayon</span>
      </div>
      <CommentInputField blogId={1} />
     <div className="my-10 space-y-4">
      <hr className="max-w-[600px] border-t-2 border-gray-200" />
       <CommentCard />
     </div>
    </div>
  );
};

export default CommentSection;

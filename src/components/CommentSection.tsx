import Image from "next/image";
import React from "react";
import CommentInputField from "./CommentInputField";
import { BlogId } from "@/types/blogId";
import CommentCard from "./CommentCard";
import { useCommentsByBlogId } from "@/hooks/commentHooks";
import { Comment } from "@/types/commentType";

const CommentSection: React.FC<BlogId> = ({ blogId }) => {
  const { data, isLoading, isError } = useCommentsByBlogId(blogId);

  return (
    <div className="text-gray-800">
      <h1 className="font-semibold text-xl mt-16 mb-8">
        Comments ({data?.comments.length ?? 0})
      </h1>

      <div className="flex gap-x-2 items-center mb-4">
        <Image
          src={
            data?.user?.image || data?.user?.profileImage || "https://github.com/shadcn.png"
          }
          alt={data?.user?.username || "user image"}
          width={100}
          height={100}
          className="w-9 h-9 object-cover rounded-full"
        />
        <span className="font-medium">{data?.user?.username}</span>
      </div>

      <div className="mb-10">
        <CommentInputField blogId={blogId} />
      </div>

      <div className="my-10 space-y-4">
        {isLoading && <p>Loading comments...</p>}
        {isError && <p className="text-red-500">Failed to load comments.</p>}
        {data?.comments
          .slice()
          .reverse()
          .map((comment: Comment) => (
            <React.Fragment key={comment.id}>
              <hr className="max-w-[700px] border-t-2 border-gray-200" />
              <div className="my-8">
                <CommentCard comment={comment} />
              </div>
            </React.Fragment>
          ))}
      </div>
    </div>
  );
};

export default CommentSection;

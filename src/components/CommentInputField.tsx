import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { BlogId } from "@/types/blogId";

const CommentInputField: React.FC<BlogId> = ({ blogId }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const { register, handleSubmit, watch, reset } = useForm({
    defaultValues: { content: "" },
  });

  const content = watch("content");
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isFocused) {
      timeoutId = setTimeout(() => setShowButton(true), 300);
    } else {
      setShowButton(false);
    }

    return () => clearTimeout(timeoutId);
  }, [isFocused]);

  const onSubmit = (data: { content: string }) => {
    const payload = {
      blogId,
      content: data.content,
    };
    console.log(payload);
    reset();
    setIsFocused(false);
  };

  const handleBlur = () => {
    if (!content.trim()) {
      setIsFocused(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-[600px]"
    >
      <motion.div className="border w-full border-none font-medium bg-gray-100 rounded-md p-2">
        <motion.textarea
          {...register("content", { required: true })}
          ref={(e) => {
            register("content").ref(e);
            textAreaRef.current = e;
          }}
          placeholder="What are your thoughts?"
          className="flex-1 py-2 px-2 w-full resize-none text-gray-800 placeholder:text-gray-400 focus:outline-none overflow-hidden bg-transparent border-none"
          animate={{ height: isFocused ? 120 : 34 }}
          transition={{ duration: 0.3 }}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
        />

        <AnimatePresence>
          {showButton && (
            <div className="flex justify-end mt-4 px-2">
              <motion.button
                type="submit"
                disabled={!content.trim()}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className=" bg-blue-500 text-white px-4 py-1 rounded-md text-sm disabled:opacity-50"
              >
                Comment
              </motion.button>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </form>
  );
};

export default CommentInputField;

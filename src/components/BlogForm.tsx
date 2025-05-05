"use client";
import * as React from "react";
import { useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import MenuBar from "../components/MenuBar";
import CreatableSelect from "react-select/creatable";

const BlogForm: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [title, setTitle] = useState<string>("");
  const [genres, setGenres] = useState<{ value: string; label: string }[]>([]);
  const [content, setContent] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Predefined genre options for autocomplete
  const genreOptions = [
    { value: "Fashion", label: "Fashion" },
    { value: "Technology", label: "Technology" },
    { value: "Food", label: "Food" },
    { value: "Travel", label: "Travel" },
    { value: "Lifestyle", label: "Lifestyle" },
    { value: "Health", label: "Health" },
    { value: "Fitness", label: "Fitness" },
    { value: "Beauty", label: "Beauty" },
    { value: "Gaming", label: "Gaming" },
    { value: "Education", label: "Education" },
    { value: "Business", label: "Business" },
    { value: "Finance", label: "Finance" },
    { value: "Art", label: "Art" },
    { value: "Photography", label: "Photography" },
    { value: "Music", label: "Music" },
  ];

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && imageRef.current) {
      const imageUrl = URL.createObjectURL(file);
      imageRef.current.src = imageUrl;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("genres", JSON.stringify(genres.map((g) => g.value))); // Send genres as JSON array
    formData.append("content", content);

    if (fileInputRef.current?.files?.[0]) {
      formData.append("featuredImage", fileInputRef.current.files[0]);
    }

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to submit form");
      const result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center items-center min-h-screen bg-purple-100">
      <div className="bg-purple-200 p-6 rounded-lg shadow-lg w-4/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Section */}
          <div>
            <h2 className="text-2xl font-semibold text-purple-900 mb-4">
              Create Post
            </h2>
            <label className="block text-purple-900 font-medium">
              What is the title of your work?
            </label>
            <input
              type="text"
              placeholder="Type here"
              className="w-full p-2 mt-2 border rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <label className="block mt-4 text-purple-900 font-medium">
              Select or add genres
            </label>
            <CreatableSelect
              isMulti
              options={genreOptions}
              value={genres}
              onChange={(newValue) => setGenres(newValue as { value: string; label: string }[])}
              placeholder="Type or select genres..."
              className="mt-2"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "0.25rem",
                  borderColor: "#d1d5db",
                  backgroundColor: "#fff",
                  padding: "0.25rem",
                }),
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: "#d8b4fe", // Purple-300
                  borderRadius: "0.5rem",
                }),
                multiValueLabel: (base) => ({
                  ...base,
                  color: "#4c1d95", // Purple-900
                }),
                multiValueRemove: (base) => ({
                  ...base,
                  color: "#4c1d95",
                  ":hover": {
                    backgroundColor: "#a78bfa", // Purple-400
                    color: "#fff",
                  },
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "#9ca3af",
                }),
              }}
              required
            />

            <label className="block mt-4 text-purple-900 font-medium">
              Enter Your Content
            </label>
            <div className="mt-2">
              {editor && <MenuBar editor={editor} />}
              <div className="bg-white rounded border p-2 min-h-[16rem]">
                <EditorContent editor={editor} className="min-h-[14rem]" />
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="bg-purple-300 p-4 rounded-lg">
            <h3 className="text-purple-900 font-medium">Featured Image</h3>
            <div className="mt-4 bg-white p-4 rounded-lg flex justify-center items-center">
              <img
                ref={imageRef}
                src="https://via.placeholder.com/300"
                alt="Placeholder"
                className="w-full h-40 object-cover rounded-lg"
              />
            </div>
            <label className="block mt-4 text-purple-900 font-medium">
              Pick an image
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full mt-2 p-2 border rounded"
            />
          </div>
        </div>

        <div className="mt-6 text-right">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default BlogForm;
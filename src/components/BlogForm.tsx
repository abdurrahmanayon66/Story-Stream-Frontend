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

const BlogForm: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [title, setTitle] = useState<string>("");
  const [genre, setGenre] = useState<string>("Fashion");
  const [content, setContent] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      // Removed the automatic insertion into editor
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('genre', genre);
    formData.append('content', content);

    if (fileInputRef.current?.files?.[0]) {
      formData.append('featuredImage', fileInputRef.current.files[0]);
    }

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to submit form');
      const result = await response.json();
      console.log('Success:', result);
      // Handle success (redirect, show message, etc.)
    } catch (error) {
      console.error('Error:', error);
      // Handle error
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
              Select the genre
            </label>
            <select 
              className="w-full p-2 mt-2 border rounded"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
            >
              <option>Fashion</option>
              <option>Technology</option>
              <option>Food</option>
              <option>Travel</option>
            </select>

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
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default BlogForm;
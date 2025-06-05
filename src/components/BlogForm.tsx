"use client";
import React, { useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import MenuBar from "../components/MenuBar";
import CreatableSelect from "react-select/creatable";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Zod schema for form validation
const blogFormSchema = z.object({
  title: z.string().min(1, "Title is required").min(3, "Title must be at least 3 characters"),
  description: z.string().min(1, "Description is required").min(10, "Description must be at least 10 characters"),
  genres: z.array(z.object({
    value: z.string(),
    label: z.string()
  })).min(1, "Please select at least one genre"),
  featuredImage: z.instanceof(FileList).refine(
    (files) => files.length > 0,
    "Featured image is required"
  ).refine(
    (files) => {
      const file = files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      return allowedTypes.includes(file?.type);
    },
    "Please upload a valid image file (JPEG, PNG, WebP, or GIF)"
  ).refine(
    (files) => {
      const file = files[0];
      const maxSize = 2 * 1024 * 1024; 
      return file?.size <= maxSize;
    },
    "Image file size must be less than 2MB"
  ),
});

type BlogFormData = z.infer<typeof blogFormSchema>;

const BlogForm: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [content, setContent] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showContentError, setShowContentError] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogFormSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      genres: [],
      featuredImage: undefined,
    },
  });

  // Predefined genre options
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
      TextStyle,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Color.configure({
        types: ['textStyle'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Subscript,
      Superscript,
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
      setShowContentError(false); // Hide error when user starts typing
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && imageRef.current) {
      const imageUrl = URL.createObjectURL(file);
      imageRef.current.src = imageUrl;
    }
    // Trigger validation for the file input
    trigger("featuredImage");
  };

  // Prevent form submission on Enter key press and button clicks within editor
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.target !== e.currentTarget) {
      e.preventDefault();
    }
  };

  // Prevent button clicks in editor from submitting form
  const handleEditorButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onSubmit = async (data: BlogFormData) => {
    setIsSubmitting(true);

    // Validate content from editor
    if (!content || Object.keys(content).length === 0 || !editor?.getText().trim()) {
      toast.error("Content cannot be empty");
      setShowContentError(true);
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title.trim());
    formData.append("description", data.description.trim());
    formData.append("genres", JSON.stringify(data.genres.map((g) => g.value)));
    formData.append("content", content);
    formData.append("featuredImage", data.featuredImage[0]);

    try {
      const response = await fetch("/api/create-blog", {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Handle specific HTTP status codes
        switch (response.status) {
          case 400:
            toast.error(responseData.error || "Invalid data provided. Please check your inputs.");
            break;
          case 401:
            toast.error("You need to be logged in to create a post");
            break;
          case 413:
            toast.error("File too large. Please choose a smaller image.");
            break;
          case 422:
            toast.error(responseData.error || "Validation failed. Please check your data.");
            break;
          case 500:
            toast.error(responseData.error || "Server error. Please try again later.");
            break;
          default:
            toast.error(responseData.error || `Unexpected error (${response.status})`);
        }
        return;
      }

      toast.success("Post created successfully!");
      // Reset form or redirect as needed
      
    } catch (error) {
      // Network errors, JSON parsing errors, etc.
      if (error instanceof Error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          toast.error("Network error. Please check your internet connection.");
        } else if (error.name === 'SyntaxError') {
          toast.error("Server response error. Please try again.");
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-purple-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={handleKeyDown}
        className="bg-purple-200 p-6 rounded-lg shadow-lg w-4/5"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Section */}
          <div>
            <h2 className="text-2xl font-semibold text-purple-900 mb-4">
              Create Post
            </h2>
            
            {/* Title Field */}
            <div className="mb-4">
              <label className="block text-purple-900 font-medium">
                What is the title of your work? *
              </label>
              <input
                type="text"
                placeholder="Type here"
                className={`w-full p-2 mt-2 border rounded ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register("title")}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Description Field */}
            <div className="mb-4">
              <label className="block text-purple-900 font-medium">
                Description *
              </label>
              <textarea
                placeholder="Enter a brief description of your post"
                rows={3}
                className={`w-full p-2 mt-2 border rounded resize-vertical ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* Genres Field */}
            <div className="mb-4">
              <label className="block text-purple-900 font-medium">
                Select or add genres *
              </label>
              <Controller
                name="genres"
                control={control}
                render={({ field }) => (
                  <CreatableSelect
                    {...field}
                    isMulti
                    options={genreOptions}
                    placeholder="Type or select genres..."
                    className="mt-2"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: "0.25rem",
                        borderColor: errors.genres ? "#ef4444" : "#d1d5db",
                        backgroundColor: "#fff",
                        padding: "0.25rem",
                      }),
                      multiValue: (base) => ({
                        ...base,
                        backgroundColor: "#d8b4fe",
                        borderRadius: "0.5rem",
                      }),
                      multiValueLabel: (base) => ({
                        ...base,
                        color: "#4c1d95",
                      }),
                      multiValueRemove: (base) => ({
                        ...base,
                        color: "#4c1d95",
                        ":hover": {
                          backgroundColor: "#a78bfa",
                          color: "#fff",
                        },
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "#9ca3af",
                      }),
                    }}
                  />
                )}
              />
              {errors.genres && (
                <p className="text-red-500 text-sm mt-1">{errors.genres.message}</p>
              )}
            </div>

            {/* Content Field */}
            <div className="mb-4">
              <label className="block text-purple-900 font-medium">
                Enter Your Content *
              </label>
              <div className="mt-2">
                <div onClick={handleEditorButtonClick}>
                  {editor && <MenuBar editor={editor} />}
                </div>
                <div className="bg-white rounded border p-2 min-h-[16rem]">
                  <EditorContent editor={editor} className="min-h-[14rem]" />
                </div>
                {showContentError && (
                  <p className="text-red-500 text-sm mt-1">Content is required</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="bg-purple-300 p-4 rounded-lg">
            <h3 className="text-purple-900 font-medium">Featured Image *</h3>
            <div className="mt-4 bg-white p-4 rounded-lg flex justify-center items-center">
              <img
                ref={imageRef}
                src="https://via.placeholder.com/300"
                alt="Placeholder"
                className="w-full h-40 object-cover rounded-lg"
              />
            </div>
            <div className="mt-4">
              <label className="block text-purple-900 font-medium">
                Pick an image *
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className={`w-full mt-2 p-2 border rounded ${
                  errors.featuredImage ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register("featuredImage")}
                onChange={handleImageChange}
              />
              {errors.featuredImage && (
                <p className="text-red-500 text-sm mt-1">{errors.featuredImage.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 text-right">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
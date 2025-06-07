"use client";
import { useParams } from 'next/navigation';
import AuthorInfo from '@/components/AuthorInfo';
import BlogContent from '@/components/BlogContent';
import CommentSection from '@/components/CommentSection';
import RecommendationBlogs from '@/components/RecommendationBlogs';
import React from 'react';

const Page = () => {
  const params = useParams();
  const blogId = Number(params?.blogId);
  return (
    <div className='grid grid-cols-12 gap-x-20'>
      <section className='col-span-8 space-y-6 bg-white px-4 py-4 rounded-lg'>
        <div className='rounded-2xl'>
          <BlogContent blogId={blogId} />
        </div>
        <div>
          <CommentSection blogId={blogId} />
        </div>
      </section>
      <section className='col-span-4 space-y-6'>
        <div className='bg-white rounded-2xl p-6 shadow-sm'>
          <AuthorInfo blogId={blogId} />
        </div>
        <div className='bg-white rounded-2xl p-6 shadow-sm'>
          <RecommendationBlogs blogId={blogId} />
        </div>
      </section>
    </div>
  );
};

export default Page;

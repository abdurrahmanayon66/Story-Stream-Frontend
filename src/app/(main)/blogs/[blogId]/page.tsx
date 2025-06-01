"use client";
import AuthorInfo from '@/components/AuthorInfo';
import BlogContent from '@/components/BlogContent';
import RecommendationBlogs from '@/components/RecommendationBlogs';
import React from 'react'

const page = () => {
  return (
    <div className='grid grid-cols-12 gap-x-20'>
      <section className='col-span-8 space-y-6'>
        <div className='rounded-2xl'>
          <BlogContent/>
        </div>
      </section>
      <section className='col-span-4 space-y-6'>
         <div className='bg-white rounded-2xl p-6 shadow-sm'>
         <AuthorInfo/>
        </div>
         <div className='bg-white rounded-2xl p-6 shadow-sm'>
        <RecommendationBlogs/>
        </div>
      </section>
    </div>
  )
}

export default page
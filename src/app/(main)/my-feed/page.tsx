"use client";
import BlogsSection from '@/components/BlogsSection';
import Followers from '@/components/Followers';
import SearchBar from '@/components/SearchBar'
import Tab from '@/components/Tab';
import TrendingTags from '@/components/TrendingTags';
import React from 'react'

const page = () => {
  return (
    <div className='grid grid-cols-12 gap-x-20'>
      <section className='col-span-8 space-y-6'>
        <div className='bg-white rounded-2xl p-4 shadow-sm'>
          <SearchBar onSearch={(query) => console.log(query)}/>
        </div>
        <div className='bg-white rounded-2xl p-6 shadow-sm'>
          <Tab/>
        </div>
        <div className='rounded-2xl'>
          <BlogsSection/>
        </div>
      </section>
      <section className='col-span-4 space-y-6'>
         <div className='bg-white rounded-2xl p-6 shadow-sm'>
         <TrendingTags/>
        </div>
         <div className='bg-white rounded-2xl p-6 shadow-sm'>
        <Followers  />
        </div>
      </section>
    </div>
  )
}

export default page
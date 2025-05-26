"use client";
import BlogsSection from '@/components/BlogsSection';
import SearchBar from '@/components/SearchBar'
import Tab from '@/components/Tab';
import React from 'react'

const page = () => {
  return (
    <div className='grid grid-cols-12 gap-x-20'>
      <section className='col-span-8 space-y-6'>
        <div className='bg-white rounded-2xl p-4'>
          <SearchBar onSearch={(query) => console.log(query)}/>
        </div>
        <div className='bg-white rounded-2xl p-6'>
          <Tab/>
        </div>
        <div className='rounded-2xl'>
          <BlogsSection/>
        </div>
      </section>
      <section className='col-span-4 bg-green-400'></section>
    </div>
  )
}

export default page
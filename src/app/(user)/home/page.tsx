import React from 'react'
import Image from 'next/image'
import home from '../../../assets/images/home.webp'
import about from '../../../assets/images/about.webp'
import ShowBlogs from '@/components/ShowBlogs'
import CustomSearch from '@/components/CustomSearch'
import About from '@/components/About'

const page = () => {
  return (
    <div>
      <div className="hero my-24">
        <div className="grid grid-cols-12 items-center">
          <div className='col-span-6 flex flex-col justify-center pr-10'>
            <h1 className="text-5xl font-bold text-darkPurple">Welcome to StoryStream</h1>
            <p className="py-6 text-xl text-customGray font-semibold">Share your blogs, explore new narratives, and connect with a community of passionate writers and readers. Your journey begins here!</p>
            <CustomSearch/>
            <div className='my-6 flex justify-between w-[70%] items-center'>
              <span className='text-slate-600 font-semibold'>Popular Tags :</span>
              <span className='bg-purple-200 p-2 rounded-lg text-mediumPurple font-semibold hover:cursor-pointer'>Design</span>
              <span className='bg-purple-200 p-2 rounded-lg text-mediumPurple font-semibold hover:cursor-pointer'>User Experience</span>
              <span className='bg-purple-200 p-2 rounded-lg text-mediumPurple font-semibold hover:cursor-pointer'>User Interface</span>
            </div>
          </div>
          <Image className='col-span-6' src={home} alt="Home" />
        </div>
      </div>
      <div>
        <About/>
      </div>
       <div>
        <section className='flex justify-between px-16'>
          <div className='flex flex-col gap-y-5 justify-center w-[50%] pl-10'>
            <p className='text-darkPurple font-semibold text-6xl text-left'>Resources and insights</p>
            <p className='text-purple-500 text-2xl'>The latest industry news, interviews, technologies and resources.</p>
          </div>
          <div className='w-[50%]'>
            <Image className='w-full' src={about} alt="Resources and insights" />
          </div>
        </section>
      </div>
    </div>
  )
}

export default page
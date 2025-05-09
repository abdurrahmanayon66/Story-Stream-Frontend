import LoginForm from '@/components/LoginForm'
import React from 'react'

const page = () => {
  return (
     <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <LoginForm className="w-full max-w-md rounded-lg bg-white p-8 shadow-md" />
    </div>
  )
}

export default page
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RegistrationForm from '@/components/RegistrationForm';
import LoginForm from '@/components/LoginForm';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  // Animation variants for sliding
  const imageVariants = {
    left: { x: '0%', transition: { duration: 0.5, ease: 'easeInOut' } },
    right: { x: '100%', transition: { duration: 0.5, ease: 'easeInOut' } },
  };

  const formVariants = {
    left: { x: '-100%', transition: { duration: 0.5, ease: 'easeInOut' } },
    right: { x: '0%', transition: { duration: 0.5, ease: 'easeInOut' } },
  };

  return (
    <div className="min-h-screen mx-32 w-full flex items-center justify-center bg-gray-100">
      <div className="w-full h-[600px] flex overflow-hidden rounded-2xl shadow-2xl">
        {/* Image Section */}
        <motion.div
          className="w-1/2 h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')`,
          }}
          initial={isLogin ? 'left' : 'right'}
          animate={isLogin ? 'left' : 'right'}
          variants={imageVariants}
        />

        {/* Form Section */}
        <motion.div
          className="w-1/2 h-full flex items-center justify-center bg-white relative"
          initial={isLogin ? 'right' : 'left'}
          animate={isLogin ? 'right' : 'left'}
          variants={formVariants}
        >
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <LoginForm className="p-8" />
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <RegistrationForm className="p-8" onToggleForm={toggleForm} />
              </motion.div>
            )}
          </AnimatePresence>
          {/* Toggle Button */}
          <button
            onClick={toggleForm}
            className="absolute top-4 right-4 text-blue-600 hover:underline text-sm font-medium"
          >
            {isLogin ? 'Create an Account' : 'Sign In'}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
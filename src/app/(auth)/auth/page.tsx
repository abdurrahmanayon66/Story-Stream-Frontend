'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import RegistrationForm from '@/components/RegistrationForm';
import LoginForm from '@/components/LoginForm';
import LottiePlayer from '@/components/LottiePlayer';
import loginAnimation from '../../../assets/lottieFiles/login.json';
import signupAnimation from '../../../assets/lottieFiles/signup.json';
import { AnimationConfigWithData } from 'lottie-web';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [currentAnimation, setCurrentAnimation] = useState<AnimationConfigWithData>(loginAnimation);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const sessionStatus = searchParams.get('session');
    if (sessionStatus === 'invalid' || sessionStatus === 'error') {
      const destroySession = async () => {
        try {
          await signOut({ redirect: false });
          router.replace('/auth');
        } catch (error) {
          console.error('Failed to sign out:', error);
          router.replace('/auth');
        }
      };
      destroySession();
    }
  }, [searchParams, router]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentAnimation(isLogin ? loginAnimation : signupAnimation);
    }, 300); 

    return () => clearTimeout(timeout);
  }, [isLogin]);

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

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
        <motion.div
          className="w-1/2 h-full bg-white flex items-center justify-center"
          initial={isLogin ? 'left' : 'right'}
          animate={isLogin ? 'left' : 'right'}
          variants={imageVariants}
        >
          <LottiePlayer
            animationData={currentAnimation}
            className="w-[90%] h-[90%]"
          />
        </motion.div>

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

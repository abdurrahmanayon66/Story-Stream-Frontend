'use client';
import { useState, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface LoginFormProps {
  className?: string;
}

export default function LoginForm({ className }: LoginFormProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { data: session, status } = useSession();

 const handleCredentialsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (loading) return;
  setLoading(true);

  try {
    // Clear any existing session before signing in
    await signOut({ redirect: false });
    
    // Small delay to ensure session is fully cleared
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) throw new Error(result.error);
    if (!result?.ok) throw new Error('Login failed: Invalid credentials');
    
    toast.success('Login successful!');
    router.push('/my-feed');
  } catch (error: any) {
    toast.error(error.message);
    setLoading(false);
  }
};

const handleGoogleSignIn = async () => {
  if (loading) return;
  setLoading(true);

  try {
    // Clear any existing session before signing in
    await signOut({ redirect: false });
    
    // Small delay to ensure session is fully cleared
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const result = await signIn('google', { 
      redirect: false,
      callbackUrl: '/my-feed' 
    });
    
    if (result?.error) throw new Error(result.error);
    if (!result?.ok) throw new Error('Google login failed: Invalid response from server');
    
    toast.success('Google login successful!');
    router.push('/my-feed');
  } catch (error: any) {
    setLoading(false);
  }
};

  return (
    <div className={`bg-white p-8 rounded-2xl shadow-lg w-full max-w-md ${className}`}>
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Sign In</h2>
      <form onSubmit={handleCredentialsSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In with Email'}
        </button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">or continue with</p>
        <button
          onClick={handleGoogleSignIn}
          className="mt-3 w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-gray-200 transition disabled:bg-gray-50"
          disabled={loading}
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path
              fill="#4285F4"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#34A853"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36  personally identifiable information redacted-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#EA4335"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
          {loading ? 'Processing...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  );
}
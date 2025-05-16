'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { signIn } from 'next-auth/react';

interface RegistrationFormProps {
  className?: string;
  onToggleForm: () => void; // To switch to LoginForm
}

export default function RegistrationForm({ className, onToggleForm }: RegistrationFormProps) {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Build multipart form data for GraphQL mutation
      const query = `
        mutation Register($input: RegisterInput!) {
          register(input: $input) {
            ... on AuthPayload {
              accessToken
              refreshToken
              user {
                id
                username
                email
                image
              }
            }
            ... on AuthError {
              message
              code
            }
          }
        }
      `;

      const variables = {
        input: {
          username,
          email,
          password,
          image: null, // to be mapped
        },
      };

      const map = image ? { '0': ['variables.input.image'] } : {};
      const formData = new FormData();
      formData.append('operations', JSON.stringify({ query, variables }));
      formData.append('map', JSON.stringify(map));
      if (image) formData.append('0', image);

      // Send registration request to API route
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: formData,
      });

      const { data } = await res.json();
      const result = data?.register;

      if (!result || result.__typename === 'AuthError') {
        throw new Error(result?.message || 'Registration failed');
      }

      // Trigger NextAuth sign-in to create session
      const signInResult = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (signInResult?.error || !signInResult?.ok) {
        throw new Error(signInResult?.error || 'Failed to sign in after registration');
      }

      toast.success('Registration successful! Redirecting...');
      router.push('/home');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
    } else {
      toast.error('Please select a valid image file');
    }
  };

  return (
    <div className={`bg-white p-8 rounded-2xl shadow-lg w-full max-w-md ${className}`}>
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Create Account</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
            disabled={loading}
          />
        </div>
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
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Profile Image (Optional)
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Already have an account?{' '}
          <button
            onClick={onToggleForm}
            className="text-blue-600 hover:underline"
            disabled={loading}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
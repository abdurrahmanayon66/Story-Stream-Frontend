'use client';

import { useSearchParams } from 'next/navigation';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
      <p className="text-gray-700">Error: {error || 'Unknown error'}</p>
    </div>
  );
}

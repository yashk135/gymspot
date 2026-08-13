'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Profile page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#1A1A2E] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6 p-8 bg-[#161626] border border-white/10 rounded-2xl">
        <div className="mx-auto w-16 h-16 rounded-full bg-[#FF5722]/10 flex items-center justify-center">
          <span className="text-3xl">👤</span>
        </div>
        <h2 className="text-2xl font-bold text-white font-syne">Profile Error</h2>
        <p className="text-sm text-gray-400">
          There was an issue loading your profile. Please try again.
        </p>
        <div className="text-left bg-black/40 p-3 rounded-lg overflow-auto max-h-32">
          <p className="text-[10px] text-red-400 font-mono break-all">
            {error?.message || 'Unknown error'}
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold rounded-xl transition-all text-sm"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all text-sm"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

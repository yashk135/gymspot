'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#1A1A2E] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-6 p-8 bg-[#161626] border border-white/10 rounded-2xl">
        <div className="mx-auto w-16 h-16 rounded-full bg-[#FF5722]/10 flex items-center justify-center">
          <span className="text-3xl">⚠️</span>
        </div>
        <h2 className="text-2xl font-bold text-white font-syne">Something Went Wrong</h2>
        <div className="text-left bg-black/40 p-4 rounded-lg overflow-auto max-h-48">
          <p className="text-xs text-red-400 font-mono break-all">
            {error?.message || 'Unknown error'}
          </p>
          <p className="text-[10px] text-gray-500 font-mono mt-2 break-all">
            {error?.stack?.slice(0, 500) || 'No stack trace'}
          </p>
        </div>
        <p className="text-sm text-gray-400">
          Don&apos;t worry — this is temporary. Try refreshing the page.
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-[#FF5722]/30"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

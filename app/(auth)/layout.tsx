import { Dumbbell } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#1A1A2E] flex flex-col">
      {/* Minimal Auth Header */}
      <header className="w-full h-16 px-6 flex items-center border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 font-syne font-extrabold text-xl text-white">
          <Dumbbell className="w-6 h-6 text-[#FF5722]" />
          Gym<span className="text-[#FF5722]">Spot</span>
        </Link>
      </header>

      {/* Auth Content */}
      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Decorative background gradients */}
        <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-[#FF5722]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-40 w-[400px] h-[400px] bg-[#FF5722]/5 rounded-full blur-3xl pointer-events-none" />
        {children}
      </main>
    </div>
  );
}

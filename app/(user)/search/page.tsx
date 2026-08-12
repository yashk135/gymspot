'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { GymCard, GymCardData } from '@/components/gym/GymCard';
import { FilterBar } from '@/components/shared/FilterBar';
import { useNearbyGyms } from '@/hooks/useGyms';
import { Search, Dumbbell, Loader2 } from 'lucide-react';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { data, isLoading } = useNearbyGyms();

  const gyms: GymCardData[] = data?.gyms || [];

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">
      <div className="space-y-2 border-b border-white/10 pb-4">
        <h1 className="text-3xl font-syne font-bold text-white flex items-center gap-2">
          <Search className="w-6 h-6 text-[#FF5722]" /> Search Gyms
        </h1>
        {query && (
          <p className="text-sm text-gray-400">
            Showing search results for <span className="text-[#FF5722] font-semibold">&ldquo;{query}&rdquo;</span> ({gyms.length} gyms found)
          </p>
        )}
      </div>

      <FilterBar />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : gyms.length === 0 ? (
        <div className="p-12 text-center border border-white/10 rounded-2xl bg-[#161626] space-y-4">
          <div className="mx-auto p-4 bg-white/5 rounded-full w-fit text-gray-500">
            <Dumbbell className="w-12 h-12" />
          </div>
          <h3 className="text-xl font-bold text-white">No Gyms Found</h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            Try adjusting your search term or distance filters to see more results.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gyms.map((gym) => (
            <GymCard key={gym.id} gym={gym} />
          ))}
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-col">
      <Navbar />
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF5722]" />
        </div>
      }>
        <SearchPageContent />
      </Suspense>
      <Footer />
    </div>
  );
}

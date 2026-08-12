'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { GymCard, GymCardData } from '@/components/gym/GymCard';
import { GymMap } from '@/components/gym/GymMap';
import { FilterBar } from '@/components/shared/FilterBar';
import { useLocationStore } from '@/hooks/useLocation';
import { useFilterStore } from '@/hooks/useFilters';
import { useNearbyGyms } from '@/hooks/useGyms';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  MapPin,
  Navigation,
  Sparkles,
  Grid,
  Map as MapIcon,
  Zap,
  Clock,
  Dumbbell,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

const LIVE_DEALS = [
  {
    id: 'd1',
    gymName: 'Golds Gym Andheri',
    title: 'Flat 30% OFF Annual VIP Membership',
    code: 'GYM30',
    expires: 'Ends in 04h 12m',
    discount: '30% OFF',
  },
  {
    id: 'd2',
    gymName: 'Cult Fit Bandra',
    title: 'Free 3-Day All Access Pass + Shaker Bottle',
    code: 'CULTFREE',
    expires: 'Ends in 12h 45m',
    discount: 'FREE PASS',
  },
  {
    id: 'd3',
    gymName: 'Zenith Yoga Juhu',
    title: '50% OFF First Month Reformer Pilates',
    code: 'ZENYOGA',
    expires: 'Ends in 01d 08h',
    discount: '50% OFF',
  },
];

export default function HomePage() {
  const { city, isGpsAllowed, requestGpsLocation, setCity, loading: locLoading } = useLocationStore();
  const { searchQuery, setSearchQuery } = useFilterStore();
  const { data, isLoading, isError } = useNearbyGyms();

  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    // Attempt GPS detection on first load
    requestGpsLocation();
  }, [requestGpsLocation]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const gymsList: GymCardData[] = data?.gyms || [];
  const featuredGyms = gymsList.filter((g) => g.is_featured);

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-col selection:bg-[#FF5722] selection:text-white">
      {/* Shared Auth-Aware Navbar */}
      <Navbar />

      {/* Hero Header Section */}
      <section className="relative py-12 md:py-20 px-4 md:px-8 bg-gradient-to-b from-[#161626] to-[#1A1A2E] border-b border-white/5 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#FF5722]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <MapPin className="w-3.5 h-3.5 text-[#FF5722]" /> Showing Gyms Near:{' '}
            <span className="text-white font-bold">{city}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-syne text-white leading-tight">
            Find Your <span className="text-[#FF5722]">Perfect Gym</span> Near You
          </h1>
          <p className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto font-normal">
            Verified membership prices, side-by-side comparison, exclusive deals, and 1-click free trial passes.
          </p>

          {/* Search Box & GPS Trigger */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 pt-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search gym name, area, or city (e.g. Bandra, Yoga)..."
                className="h-13 pl-12 pr-4 bg-[#161626] border-white/20 text-white placeholder:text-gray-500 rounded-xl text-sm focus:border-[#FF5722] focus:ring-[#FF5722]"
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                onClick={requestGpsLocation}
                disabled={locLoading}
                variant="outline"
                className="h-13 px-4 border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-xl flex items-center gap-2 shrink-0 text-xs"
              >
                {locLoading ? <Loader2 className="w-4 h-4 animate-spin text-[#FF5722]" /> : <Navigation className="w-4 h-4 text-[#FF5722]" />}
                <span className="hidden sm:inline">Use GPS</span>
              </Button>

              <Button
                type="submit"
                className="h-13 px-7 bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold rounded-xl shadow-lg shadow-[#FF5722]/30 text-sm shrink-0"
              >
                Search Gyms
              </Button>
            </div>
          </form>

          {/* Quick City Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-gray-400">
            <span>Popular Cities:</span>
            {['Mumbai', 'Delhi', 'Bangalore', 'Dubai', 'London'].map((c) => (
              <button
                key={c}
                onClick={() => setCity(c)}
                className={`hover:text-[#FF5722] transition-colors ${city === c ? 'text-[#FF5722] font-bold underline' : ''}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* KILLER FEATURE #4: Live Deals Strip */}
      <section className="py-6 px-4 md:px-8 border-b border-white/5 bg-[#161626]/50">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-syne font-bold text-sm text-white">
              <Zap className="w-4 h-4 text-[#FF5722]" /> Exclusive Live Deals & Offer Passes
            </div>
            <span className="text-xs text-[#FF5722] font-medium">Updated 5 mins ago</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {LIVE_DEALS.map((deal) => (
              <div
                key={deal.id}
                className="p-4 rounded-xl bg-gradient-to-br from-[#161626] to-[#1A1A2E] border border-[#FF5722]/30 space-y-2 relative overflow-hidden"
              >
                <div className="flex justify-between items-start">
                  <Badge className="bg-[#FF5722] text-white text-[10px] font-extrabold px-2 py-0.5">
                    {deal.discount}
                  </Badge>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" /> {deal.expires}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white">{deal.gymName}</h4>
                <p className="text-xs text-gray-300 line-clamp-1">{deal.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area: Filter Bar + Gym Grid / Map View */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">
        {/* Section Header with List ↔ Map View Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl font-syne font-bold text-white flex items-center gap-2">
              <Dumbbell className="w-6 h-6 text-[#FF5722]" /> Gyms Near You ({gymsList.length})
            </h2>
            <p className="text-xs text-gray-400">Discover gyms within {useFilterStore.getState().radiusKm}km of your location</p>
          </div>

          {/* Toggle Button */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" /> List View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'map'
                  ? 'bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" /> Map View
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar />

        {/* Content View: Grid or Map */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : viewMode === 'map' ? (
          <GymMap gyms={gymsList} />
        ) : gymsList.length === 0 ? (
          <div className="p-12 text-center border border-white/10 rounded-2xl bg-[#161626] space-y-4">
            <div className="mx-auto p-4 bg-white/5 rounded-full w-fit text-gray-500">
              <Dumbbell className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-white">No Gyms Found Nearby</h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Try increasing your search radius or clearing active filters to see more gyms.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Featured / Boosted Gyms Section */}
            {featuredGyms.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-syne font-bold text-sm text-[#FF5722]">
                  <Sparkles className="w-4 h-4" /> Top Featured Gyms
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredGyms.map((gym) => (
                    <GymCard key={gym.id} gym={gym} />
                  ))}
                </div>
              </div>
            )}

            {/* All Nearby Gyms */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-300">All Nearby Listings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gymsList.map((gym) => (
                  <GymCard key={gym.id} gym={gym} />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

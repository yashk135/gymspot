'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { GymCard, GymCardData } from '@/components/gym/GymCard';
import { Button } from '@/components/ui/button';
import { Heart, Dumbbell, ArrowRight } from 'lucide-react';

const SAMPLE_SAVED_GYMS: GymCardData[] = [
  {
    id: 'g1111111-1111-1111-1111-111111111111',
    name: 'Golds Gym — Andheri West',
    description: 'Flagship fitness centre with Hammer Strength machinery & steam rooms.',
    address: 'Veera Desai Road, Andheri West, Mumbai',
    lat: 19.1363,
    lng: 72.8277,
    gym_type: 'General',
    gender_type: 'Co-ed',
    is_verified: true,
    is_featured: true,
    total_rating: 4.8,
    rating_count: 142,
    starting_price: 3500,
    currency: 'INR',
    cover_photo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    distance_km: 1.2,
  },
  {
    id: 'g2222222-2222-2222-2222-222222222222',
    name: 'Cult Fit — Bandra West',
    description: 'High-energy group workouts including Boxing & HRX.',
    address: 'Hill Road, Bandra West, Mumbai',
    lat: 19.0596,
    lng: 72.8295,
    gym_type: 'CrossFit',
    gender_type: 'Co-ed',
    is_verified: true,
    is_featured: true,
    total_rating: 4.9,
    rating_count: 210,
    starting_price: 3333,
    currency: 'INR',
    cover_photo: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    distance_km: 4.5,
  },
];

export default function SavedGymsPage() {
  const [savedGyms, setSavedGyms] = useState<GymCardData[]>(SAMPLE_SAVED_GYMS);

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-col selection:bg-[#FF5722] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-syne font-bold text-white flex items-center gap-2">
              <Heart className="w-6 h-6 text-[#FF5722] fill-[#FF5722]" /> Saved Gyms ({savedGyms.length})
            </h1>
            <p className="text-sm text-gray-400">Gyms you have bookmarked for quick access and price tracking</p>
          </div>
        </div>

        {savedGyms.length === 0 ? (
          <div className="p-12 text-center border border-white/10 rounded-2xl bg-[#161626] space-y-4">
            <div className="mx-auto p-4 bg-white/5 text-gray-500 rounded-full w-fit">
              <Dumbbell className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-white">No Saved Gyms Yet</h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Start exploring gyms near you and click the heart icon to save your favorite spots.
            </p>
            <Link href="/">
              <Button className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold text-xs h-10 px-6">
                Explore Gyms Near Me <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedGyms.map((gym) => (
              <GymCard key={gym.id} gym={gym} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

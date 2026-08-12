'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Building2, Search, Sparkles, ShieldCheck, ArrowLeft, Star, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface GymAdminItem {
  id: string;
  name: string;
  city: string;
  gymType: string;
  rating: number;
  price: number;
  isVerified: boolean;
  isFeatured: boolean;
  status: 'approved' | 'pending' | 'suspended';
  coverPhoto: string;
}

const SAMPLE_ALL_GYMS: GymAdminItem[] = [
  {
    id: 'g1111111-1111-1111-1111-111111111111',
    name: 'Golds Gym — Andheri West',
    city: 'Mumbai',
    gymType: 'General',
    rating: 4.8,
    price: 3500,
    isVerified: true,
    isFeatured: true,
    status: 'approved',
    coverPhoto: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'g2222222-2222-2222-2222-222222222222',
    name: 'Cult Fit — Bandra West',
    city: 'Mumbai',
    gymType: 'CrossFit',
    rating: 4.9,
    price: 3333,
    isVerified: true,
    isFeatured: true,
    status: 'approved',
    coverPhoto: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'g3333333-3333-3333-3333-333333333333',
    name: 'Powerhouse Gym — Powai',
    city: 'Mumbai',
    gymType: 'Powerlifting',
    rating: 4.5,
    price: 2000,
    isVerified: false,
    isFeatured: false,
    status: 'approved',
    coverPhoto: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
  },
];

export default function AllGymsAdminPage() {
  const [gyms, setGyms] = useState<GymAdminItem[]>(SAMPLE_ALL_GYMS);
  const [search, setSearch] = useState('');

  const toggleFeatured = (id: string) => {
    setGyms(gyms.map((g) => (g.id === id ? { ...g, isFeatured: !g.isFeatured } : g)));
    toast.success('Featured home screen boost toggled!');
  };

  const toggleVerified = (id: string) => {
    setGyms(gyms.map((g) => (g.id === id ? { ...g, isVerified: !g.isVerified } : g)));
    toast.success('Verified badge status updated!');
  };

  const filtered = gyms.filter(
    (g) => g.name.toLowerCase().includes(search.toLowerCase()) || g.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-col selection:bg-[#FF5722] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-syne font-bold text-white flex items-center gap-2">
                <Building2 className="w-6 h-6 text-[#FF5722]" /> All Gyms Directory ({gyms.length})
              </h1>
              <p className="text-sm text-gray-400">Manage all listings, toggle Featured Boosts, and grant Verified badges</p>
            </div>
          </div>

          <div className="w-full sm:w-72">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by gym name or city..."
                className="h-10 pl-9 bg-white/5 border-white/10 text-white text-xs"
              />
            </div>
          </div>
        </div>

        <Card className="bg-[#161626] border-white/10 text-white">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              {filtered.map((gym) => (
                <div
                  key={gym.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-16 rounded-lg overflow-hidden shrink-0 border border-white/10">
                      <Image src={gym.coverPhoto} alt={gym.name} fill className="object-cover" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-base font-syne">{gym.name}</h4>
                        {gym.isVerified && <ShieldCheck className="w-4 h-4 text-[#FF5722]" />}
                      </div>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#FF5722]" /> {gym.city} · {gym.gymType} · ₹{gym.price}/mo
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleFeatured(gym.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                        gym.isFeatured
                          ? 'bg-[#FF5722] border-[#FF5722] text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Featured Boost
                    </button>

                    <button
                      onClick={() => toggleVerified(gym.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                        gym.isVerified
                          ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> {gym.isVerified ? 'Verified' : 'Verify'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}

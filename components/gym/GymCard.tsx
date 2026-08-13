'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Heart, CheckCircle2, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export interface GymCardData {
  id: string;
  name: string;
  description?: string;
  address: string;
  lat: number;
  lng: number;
  gym_type: string;
  gender_type: string;
  is_verified: boolean;
  is_featured?: boolean;
  total_rating: number;
  rating_count: number;
  starting_price: number;
  currency: string;
  cover_photo: string;
  distance_km?: number;
  amenities?: string[];
  created_at?: string;
}

interface GymCardProps {
  gym: GymCardData;
}

export function GymCard({ gym }: GymCardProps) {
  const [saved, setSaved] = useState(false);

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(!saved);
    if (!saved) {
      toast.success(`Saved "${gym.name}" to your bookmarks!`);
    } else {
      toast('Removed from saved gyms');
    }
  };

  // Determine if open now (placeholder check)
  const isOpen = true;

  // Check if listing is new (within 30 days)
  const isNew = gym.created_at
    ? (new Date().getTime() - new Date(gym.created_at).getTime()) / (1000 * 3600 * 24) <= 30
    : true;

  return (
    <div className="group relative bg-[#161626] border border-white/10 rounded-2xl overflow-hidden hover:border-[#FF5722]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#FF5722]/10 flex flex-col justify-between">
      {/* Cover Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-white/5">
        <Image
          src={gym.cover_photo || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80'}
          alt={gym.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#161626] via-transparent to-black/30" />

        {/* Top Overlay Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            {gym.is_featured && (
              <Badge className="bg-[#FF5722] hover:bg-[#FF5722] text-white border-none text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 shadow-lg shadow-[#FF5722]/40">
                Featured
              </Badge>
            )}
            {isNew && (
              <Badge className="bg-emerald-500/90 text-white border-none text-[10px] font-bold px-2 py-0.5">
                New
              </Badge>
            )}
          </div>

          <button
            onClick={handleToggleSave}
            className={`p-2 rounded-full backdrop-blur-md border transition-all ${
              saved
                ? 'bg-[#FF5722] border-[#FF5722] text-white'
                : 'bg-black/40 border-white/20 text-white hover:bg-black/60'
            }`}
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Gym Type Tag on Bottom Left of Image */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <Badge variant="outline" className="bg-black/60 border-white/20 text-white backdrop-blur-md text-[11px]">
            {gym.gym_type}
          </Badge>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isOpen ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400'
          }`}>
            {isOpen ? '● Open Now' : 'Closed'}
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          {/* Header: Name + Verified */}
          <div className="flex items-start justify-between gap-2">
            <Link href={`/gym/${gym.id}`} className="group-hover:text-[#FF5722] transition-colors">
              <h3 className="font-syne font-bold text-lg text-white line-clamp-1 flex items-center gap-1.5">
                {gym.name}
                {gym.is_verified && (
                  <ShieldCheck className="w-4 h-4 text-[#FF5722] shrink-0" />
                )}
              </h3>
            </Link>
          </div>

          {/* Location & Distance */}
          <p className="text-xs text-gray-400 flex items-center gap-1 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-[#FF5722] shrink-0" />
            {gym.address}
          </p>
        </div>

        {/* Rating & Distance Badges */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{(gym.total_rating ?? 0).toFixed(1)}</span>
            <span className="text-gray-400 font-normal">({gym.rating_count ?? 0})</span>
          </div>

          {gym.distance_km !== undefined && (
            <span className="text-gray-400 font-medium text-[11px] bg-white/5 px-2 py-0.5 rounded-md">
              {gym.distance_km.toFixed(1)} km away
            </span>
          )}
        </div>

        {/* Pricing & CTA Row */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Starting From</span>
            <p className="text-lg font-extrabold text-white font-syne">
              {gym.currency === 'INR' ? '₹' : '$'}{(gym.starting_price ?? 0).toLocaleString()}
              <span className="text-xs text-gray-400 font-normal">/mo</span>
            </p>
          </div>

          <Link href={`/gym/${gym.id}`}>
            <Button className="h-9 px-4 bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-semibold text-xs flex items-center gap-1">
              View Gym <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { FreeTrialModal } from '@/components/gym/detail/FreeTrialModal';
import { useCompareStore } from '@/hooks/useCompare';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Scale,
  X,
  Star,
  MapPin,
  Check,
  Building2,
  Plus,
  Ticket,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

const ALL_AMENITIES = [
  'AC',
  'Steam Room',
  'Sauna',
  'Parking',
  'Shower',
  'Locker Room',
  'WiFi',
  'Cafeteria',
  'Free Weights',
  'Cardio Zone',
  'Personal Training',
  'Group Classes',
];

export default function ComparePage() {
  const { comparedGyms, removeGymFromCompare, clearCompare } = useCompareStore();
  const [selectedGymForTrial, setSelectedGymForTrial] = useState<{ id: string; name: string } | null>(null);

  // Auto-calculate Value Score (0 to 10 scale based on rating vs price)
  const calculateValueScore = (rating: number, price: number) => {
    if (!price || price <= 0) return '8.5';
    // Formula: (rating / 5) * 5 + (5000 / price) * 5, capped at 10
    const rawScore = (rating / 5) * 6 + Math.min(4, (4000 / price) * 4);
    return Math.min(10, Math.max(5, rawScore)).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-col selection:bg-[#FF5722] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5722]/10 text-[#FF5722] text-xs font-bold uppercase tracking-wider">
              <Scale className="w-4 h-4" /> Killer Feature #2
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold font-syne text-white">
              Side-by-Side <span className="text-[#FF5722]">Gym Comparison</span>
            </h1>
            <p className="text-sm text-gray-400">
              Compare features, verified membership prices, amenities, and value scores side-by-side.
            </p>
          </div>

          {comparedGyms.length > 0 && (
            <div className="flex items-center gap-3">
              <Button
                onClick={clearCompare}
                variant="outline"
                className="border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 text-xs"
              >
                Clear All ({comparedGyms.length})
              </Button>
              <Link href="/">
                <Button className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-semibold text-xs flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Add More Gyms
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* EMPTY STATE */}
        {comparedGyms.length === 0 ? (
          <div className="p-12 text-center border border-white/10 rounded-2xl bg-[#161626] space-y-5">
            <div className="mx-auto p-4 bg-[#FF5722]/10 text-[#FF5722] rounded-full w-fit">
              <Scale className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white font-syne">No Gyms Added for Comparison</h3>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                You can select up to 3 gyms to compare side-by-side across pricing, distance, amenities, and calculated value score.
              </p>
            </div>
            <Link href="/">
              <Button className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white px-8 h-11 font-bold text-sm shadow-lg shadow-[#FF5722]/30">
                Explore & Compare Gyms
              </Button>
            </Link>
          </div>
        ) : (
          /* COMPARISON MATRIX TABLE */
          <div className="overflow-x-auto">
            <div className="min-w-[700px] bg-[#161626] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              {/* Header Row: Gym Cards */}
              <div className="grid grid-cols-4 border-b border-white/10 bg-[#1A1A2E]/80">
                <div className="p-5 font-syne font-bold text-base text-gray-400 flex items-center">
                  Comparison Metric
                </div>
                {comparedGyms.map((gym) => (
                  <div key={gym.id} className="p-5 border-l border-white/10 relative space-y-3 flex flex-col justify-between">
                    <button
                      onClick={() => removeGymFromCompare(gym.id)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-red-400 p-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                      title="Remove from compare"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="space-y-2">
                      <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-white/10">
                        <Image src={gym.cover_photo} alt={gym.name} fill className="object-cover" />
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-bold text-white text-base line-clamp-1 flex items-center gap-1">
                          {gym.name}
                          {gym.is_verified && <ShieldCheck className="w-4 h-4 text-[#FF5722] shrink-0" />}
                        </h4>
                        <p className="text-xs text-gray-400 truncate">{gym.address}</p>
                      </div>
                    </div>

                    <div className="pt-2 space-y-2">
                      <Button
                        onClick={() => setSelectedGymForTrial({ id: gym.id, name: gym.name })}
                        className="w-full bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold text-xs h-9 flex items-center justify-center gap-1"
                      >
                        <Ticket className="w-3.5 h-3.5" /> Book Free Trial
                      </Button>
                      <Link href={`/gym/${gym.id}`}>
                        <Button variant="outline" className="w-full border-white/10 text-white text-xs h-8 hover:bg-white/5">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}

                {/* Empty slot placeholder if < 3 gyms */}
                {Array.from({ length: 3 - comparedGyms.length }).map((_, i) => (
                  <div key={i} className="p-6 border-l border-white/10 border-dashed flex flex-col items-center justify-center text-center space-y-3 text-gray-500">
                    <div className="p-3 rounded-full bg-white/5">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <p className="text-xs">Add another gym to compare</p>
                    <Link href="/">
                      <Button variant="outline" size="sm" className="border-white/10 text-xs text-gray-300">
                        + Add Gym
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>

              {/* ROW: Value Score */}
              <div className="grid grid-cols-4 border-b border-white/5 py-4 px-5 text-sm bg-[#FF5722]/5">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#FF5722]" /> GymSpot Value Score
                </div>
                {comparedGyms.map((gym) => (
                  <div key={gym.id} className="border-l border-white/10 px-5 font-extrabold text-[#FF5722] text-lg font-syne flex items-center gap-2">
                    <span>{calculateValueScore(gym.total_rating, gym.starting_price)}</span>
                    <span className="text-xs text-gray-400 font-normal">/ 10</span>
                  </div>
                ))}
                {Array.from({ length: 3 - comparedGyms.length }).map((_, i) => (
                  <div key={i} className="border-l border-white/10 px-5 text-gray-600 text-xs flex items-center">-</div>
                ))}
              </div>

              {/* ROW: Monthly Price */}
              <div className="grid grid-cols-4 border-b border-white/5 py-4 px-5 text-sm">
                <div className="font-medium text-gray-300">Cheapest Monthly Fee</div>
                {comparedGyms.map((gym) => (
                  <div key={gym.id} className="border-l border-white/10 px-5 font-bold text-white">
                    {gym.currency === 'INR' ? '₹' : '$'}{gym.starting_price.toLocaleString()}/mo
                  </div>
                ))}
                {Array.from({ length: 3 - comparedGyms.length }).map((_, i) => (
                  <div key={i} className="border-l border-white/10 px-5 text-gray-600 text-xs">-</div>
                ))}
              </div>

              {/* ROW: Rating */}
              <div className="grid grid-cols-4 border-b border-white/5 py-4 px-5 text-sm">
                <div className="font-medium text-gray-300">Rating & Reviews</div>
                {comparedGyms.map((gym) => (
                  <div key={gym.id} className="border-l border-white/10 px-5 flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{gym.total_rating.toFixed(1)}</span>
                    <span className="text-gray-400 text-xs font-normal">({gym.rating_count})</span>
                  </div>
                ))}
                {Array.from({ length: 3 - comparedGyms.length }).map((_, i) => (
                  <div key={i} className="border-l border-white/10 px-5 text-gray-600 text-xs">-</div>
                ))}
              </div>

              {/* ROW: Gym Type */}
              <div className="grid grid-cols-4 border-b border-white/5 py-4 px-5 text-sm">
                <div className="font-medium text-gray-300">Gym Type</div>
                {comparedGyms.map((gym) => (
                  <div key={gym.id} className="border-l border-white/10 px-5 text-white font-medium">
                    <Badge variant="outline" className="border-white/20 text-xs">{gym.gym_type}</Badge>
                  </div>
                ))}
                {Array.from({ length: 3 - comparedGyms.length }).map((_, i) => (
                  <div key={i} className="border-l border-white/10 px-5 text-gray-600 text-xs">-</div>
                ))}
              </div>

              {/* ROW: Gender Policy */}
              <div className="grid grid-cols-4 border-b border-white/5 py-4 px-5 text-sm">
                <div className="font-medium text-gray-300">Gender Policy</div>
                {comparedGyms.map((gym) => (
                  <div key={gym.id} className="border-l border-white/10 px-5 text-white font-medium">
                    {gym.gender_type}
                  </div>
                ))}
                {Array.from({ length: 3 - comparedGyms.length }).map((_, i) => (
                  <div key={i} className="border-l border-white/10 px-5 text-gray-600 text-xs">-</div>
                ))}
              </div>

              {/* ROW: Distance */}
              <div className="grid grid-cols-4 border-b border-white/5 py-4 px-5 text-sm">
                <div className="font-medium text-gray-300">Distance</div>
                {comparedGyms.map((gym) => (
                  <div key={gym.id} className="border-l border-white/10 px-5 text-gray-300 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#FF5722]" />
                    {gym.distance_km ? `${gym.distance_km.toFixed(1)} km` : '1.2 km'}
                  </div>
                ))}
                {Array.from({ length: 3 - comparedGyms.length }).map((_, i) => (
                  <div key={i} className="border-l border-white/10 px-5 text-gray-600 text-xs">-</div>
                ))}
              </div>

              {/* AMENITIES COMPARISON MATRIX */}
              <div className="bg-[#1A1A2E]/50">
                <div className="p-4 px-5 text-xs font-bold uppercase tracking-wider text-[#FF5722] border-b border-white/5">
                  Facilities & Amenities Comparison
                </div>
                {ALL_AMENITIES.map((amenity) => (
                  <div key={amenity} className="grid grid-cols-4 border-b border-white/5 py-3 px-5 text-xs">
                    <div className="text-gray-300 font-medium">{amenity}</div>
                    {comparedGyms.map((gym) => {
                      const hasAmenity = gym.amenities ? gym.amenities.includes(amenity) : true;
                      return (
                        <div key={gym.id} className="border-l border-white/10 px-5">
                          {hasAmenity ? (
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                              <Check className="w-4 h-4 stroke-[3]" /> Yes
                            </span>
                          ) : (
                            <span className="text-red-400/60 flex items-center gap-1">
                              <X className="w-4 h-4" /> No
                            </span>
                          )}
                        </div>
                      );
                    })}
                    {Array.from({ length: 3 - comparedGyms.length }).map((_, i) => (
                      <div key={i} className="border-l border-white/10 px-5 text-gray-600">-</div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Free Trial Modal */}
      {selectedGymForTrial && (
        <FreeTrialModal
          open={!!selectedGymForTrial}
          onOpenChange={() => setSelectedGymForTrial(null)}
          gymId={selectedGymForTrial.id}
          gymName={selectedGymForTrial.name}
        />
      )}

      <Footer />
    </div>
  );
}

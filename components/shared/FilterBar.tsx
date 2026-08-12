'use client';

import { useFilterStore, SortOption } from '@/hooks/useFilters';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SlidersHorizontal, RotateCcw, Filter } from 'lucide-react';

const DISTANCES = [
  { label: '0.5 km', value: 0.5 },
  { label: '1 km', value: 1 },
  { label: '2 km', value: 2 },
  { label: '5 km', value: 5 },
  { label: '10 km', value: 10 },
  { label: '20 km', value: 20 },
];

const GYM_TYPES = ['All', 'General', 'CrossFit', 'Powerlifting', 'MMA', 'Yoga', 'Zumba'];
const GENDER_POLICIES = ['All', 'Co-ed', 'Ladies Only', 'Men Only'];

export function FilterBar() {
  const {
    radiusKm,
    maxPrice,
    gymType,
    genderPolicy,
    sortBy,
    setRadiusKm,
    setMaxPrice,
    setGymType,
    setGenderPolicy,
    setSortBy,
    resetFilters,
  } = useFilterStore();

  return (
    <div className="w-full bg-[#161626] border border-white/10 rounded-2xl p-4 md:p-6 space-y-5 text-white">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 font-syne font-bold text-base text-white">
          <Filter className="w-4 h-4 text-[#FF5722]" /> Filters & Sort
        </div>

        <Button
          onClick={resetFilters}
          variant="ghost"
          size="sm"
          className="text-xs text-gray-400 hover:text-white gap-1 h-8"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </Button>
      </div>

      {/* Row 1: Distance Pills */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-300">Distance Radius</label>
        <div className="flex flex-wrap gap-2">
          {DISTANCES.map((d) => (
            <button
              key={d.value}
              onClick={() => setRadiusKm(d.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                radiusKm === d.value
                  ? 'bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/30'
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Row 2: Gym Type & Gender Policy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Gym Type */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-300">Gym Type</label>
          <div className="flex flex-wrap gap-1.5">
            {GYM_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setGymType(type)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  gymType === type
                    ? 'bg-[#FF5722] text-white'
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Gender Policy */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-300">Gender Policy</label>
          <div className="flex gap-2">
            {GENDER_POLICIES.map((policy) => (
              <button
                key={policy}
                onClick={() => setGenderPolicy(policy)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  genderPolicy === policy
                    ? 'bg-[#FF5722] text-white'
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                }`}
              >
                {policy}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Price Slider & Sort By */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/5">
        {/* Price Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-gray-300">Max Monthly Price</span>
            <span className="text-[#FF5722] font-bold">₹{maxPrice.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={1000}
            max={20000}
            step={500}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-[#FF5722] cursor-pointer"
          />
        </div>

        {/* Sort By Dropdown */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-300">Sort Results By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-full h-9 rounded-lg bg-white/5 border border-white/10 text-white text-xs px-3 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
          >
            <option value="distance">📍 Distance (Nearest First)</option>
            <option value="price_low">💰 Price (Low to High)</option>
            <option value="rating">⭐ Rating (Highest Rated)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

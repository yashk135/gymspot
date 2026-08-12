'use client';

import dynamic from 'next/dynamic';
import { GymCardData } from './GymCard';
import { useLocationStore } from '@/hooks/useLocation';

const LeafletGymMap = dynamic(() => import('./GymMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-gray-400">
      Loading Gym Discovery Map...
    </div>
  ),
});

interface GymMapProps {
  gyms: GymCardData[];
}

export function GymMap({ gyms }: GymMapProps) {
  const { lat, lng } = useLocationStore();

  const centerLat = lat || 19.076;
  const centerLng = lng || 72.8777;

  return <LeafletGymMap gyms={gyms} centerLat={centerLat} centerLng={centerLng} />;
}

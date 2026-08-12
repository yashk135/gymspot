'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, ArrowUpRight } from 'lucide-react';
import { GymCardData } from './GymCard';
import 'leaflet/dist/leaflet.css';

const CustomGymIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface GymMapInnerProps {
  gyms: GymCardData[];
  centerLat: number;
  centerLng: number;
}

export default function GymMapInner({ gyms, centerLat, centerLng }: GymMapInnerProps) {
  return (
    <div className="w-full h-[500px] rounded-2xl overflow-hidden border border-white/10 relative z-0">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={12}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {gyms.map((gym) => (
          <Marker key={gym.id} position={[gym.lat, gym.lng]} icon={CustomGymIcon}>
            <Popup className="gym-map-popup">
              <div className="w-56 p-1 space-y-2 text-black">
                <div className="relative aspect-video w-full rounded-lg overflow-hidden">
                  <Image
                    src={gym.cover_photo || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80'}
                    alt={gym.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight text-gray-900">{gym.name}</h4>
                  <p className="text-[11px] text-gray-500 truncate">{gym.address}</p>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-200">
                  <div className="flex items-center gap-1 font-bold text-amber-600">
                    <Star className="w-3 h-3 fill-amber-500" />
                    <span>{gym.total_rating.toFixed(1)}</span>
                  </div>
                  <span className="font-extrabold text-[#FF5722]">
                    ₹{gym.starting_price.toLocaleString()}/mo
                  </span>
                </div>
                <Link
                  href={`/gym/${gym.id}`}
                  className="block text-center py-1 bg-[#FF5722] text-white font-bold text-xs rounded hover:bg-[#FF5722]/90 mt-2"
                >
                  View Details
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

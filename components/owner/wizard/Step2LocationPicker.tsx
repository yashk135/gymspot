'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useListingForm } from '@/hooks/useListingForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MapPin, ArrowRight, ArrowLeft, Navigation, Search } from 'lucide-react';
import { toast } from 'sonner';

// Dynamically import Leaflet Map to avoid SSR window errors
const LeafletMap = dynamic(() => import('./LeafletMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-400">
      Loading OpenStreetMap...
    </div>
  ),
});

export function Step2LocationPickerComponent() {
  const { location, basicInfo, updateLocation, nextStep, prevStep } = useListingForm();

  const [lat, setLat] = useState<number>(location.lat || 19.076);
  const [lng, setLng] = useState<number>(location.lng || 72.8777);
  const [searchQuery, setSearchQuery] = useState<string>(
    `${basicInfo.address || ''} ${basicInfo.city || ''}`.trim()
  );

  const handlePositionChange = (newLat: number, newLng: number) => {
    setLat(newLat);
    setLng(newLng);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
          toast.success('Location updated from device GPS');
        },
        () => {
          toast.error('Could not fetch current GPS location');
        }
      );
    }
  };

  const handleSearchLocation = async () => {
    if (!searchQuery) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const foundLat = parseFloat(data[0].lat);
        const foundLng = parseFloat(data[0].lon);
        setLat(foundLat);
        setLng(foundLng);
        toast.success(`Found location for "${searchQuery}"`);
      } else {
        toast.error('Location not found on map');
      }
    } catch {
      toast.error('Error searching location');
    }
  };

  const handleNext = () => {
    updateLocation({ lat, lng });
    nextStep();
  };

  return (
    <Card className="bg-[#161626] border-white/10 text-white">
      <CardContent className="p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="p-2.5 bg-[#FF5722]/10 text-[#FF5722] rounded-xl">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-syne font-bold">Step 2 — Map Location Pin</h2>
            <p className="text-xs text-gray-400">Drag the marker to pin your gym&apos;s exact entrance position</p>
          </div>
        </div>

        {/* Location Search Bar & GPS */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search area, landmark or street..."
              className="h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
            />
            <Button
              type="button"
              onClick={handleSearchLocation}
              className="h-11 bg-white/10 hover:bg-white/20 text-white px-4"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
          <Button
            type="button"
            onClick={handleUseCurrentLocation}
            variant="outline"
            className="h-11 border-[#FF5722]/40 text-[#FF5722] hover:bg-[#FF5722]/10 flex items-center gap-2"
          >
            <Navigation className="w-4 h-4" /> My GPS Location
          </Button>
        </div>

        {/* Interactive OpenStreetMap */}
        <div className="w-full rounded-xl overflow-hidden border border-white/10 shadow-lg">
          <LeafletMap lat={lat} lng={lng} onPositionChange={handlePositionChange} />
        </div>

        {/* Lat/Lng Display */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs text-gray-300">
          <div>
            <span className="text-gray-400">Selected Coordinates:</span>{' '}
            <span className="font-mono text-white font-semibold">{lat.toFixed(6)}, {lng.toFixed(6)}</span>
          </div>
          <span className="text-[#FF5722] font-medium">Pin Draggable</span>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t border-white/10">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            className="h-11 px-6 border-white/10 text-white hover:bg-white/5 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <Button
            type="button"
            onClick={handleNext}
            className="h-11 px-8 bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-semibold flex items-center gap-2"
          >
            Next: Photos <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

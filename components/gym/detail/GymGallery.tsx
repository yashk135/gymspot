'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface GymGalleryProps {
  photos: string[];
  gymName: string;
}

export function GymGallery({ photos, gymName }: GymGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  const displayPhotos = photos && photos.length > 0
    ? photos
    : ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80'];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % displayPhotos.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + displayPhotos.length) % displayPhotos.length);
  };

  return (
    <div className="space-y-3">
      {/* Main Large Photo */}
      <div className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-2xl overflow-hidden border border-white/10 group bg-[#161626]">
        <Image
          src={displayPhotos[activeIndex]}
          alt={`${gymName} photo ${activeIndex + 1}`}
          fill
          className="object-cover transition-transform duration-500"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Carousel Navigation Arrows */}
        {displayPhotos.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-[#FF5722] backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-[#FF5722] backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Fullscreen Button */}
        <button
          onClick={() => setFullscreenOpen(true)}
          className="absolute top-4 right-4 p-2.5 rounded-xl bg-black/50 text-white hover:bg-[#FF5722] backdrop-blur-md transition-all flex items-center gap-1.5 text-xs font-semibold"
        >
          <Maximize2 className="w-4 h-4" /> Fullscreen
        </button>

        {/* Photo Index Counter */}
        <div className="absolute bottom-4 right-4 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-mono">
          {activeIndex + 1} / {displayPhotos.length}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {displayPhotos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {displayPhotos.map((url, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                activeIndex === idx ? 'border-[#FF5722] scale-105 shadow-md shadow-[#FF5722]/30' : 'border-white/10 opacity-60 hover:opacity-100'
              }`}
            >
              <Image src={url} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      <Dialog open={fullscreenOpen} onOpenChange={setFullscreenOpen}>
        <DialogContent className="max-w-5xl bg-black/95 border-none text-white p-2">
          <DialogTitle className="sr-only">{gymName} Gallery Lightbox</DialogTitle>
          <div className="relative aspect-[16/9] w-full">
            <Image src={displayPhotos[activeIndex]} alt={`${gymName} Fullscreen`} fill className="object-contain" />
          </div>
          <div className="flex justify-between items-center px-4 py-2 text-xs text-gray-400">
            <span>{gymName} Photo Gallery</span>
            <span>{activeIndex + 1} of {displayPhotos.length}</span>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

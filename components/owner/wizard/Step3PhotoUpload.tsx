'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useListingForm } from '@/hooks/useListingForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Upload,
  Trash2,
  Star,
  ArrowRight,
  ArrowLeft,
  Image as ImageIcon,
  Sparkles,
  Plus,
  FolderOpen,
  Camera,
  Link2,
} from 'lucide-react';
import { toast } from 'sonner';

const SAMPLE_PRESETS = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1200&q=80',
];

type UploadTab = 'device' | 'camera' | 'url';

export function Step3PhotoUploadComponent() {
  const { photos, updatePhotos, nextStep, prevStep } = useListingForm();

  const [photoList, setPhotoList] = useState<string[]>(photos.photos || []);
  const [coverIndex, setCoverIndex] = useState<number>(photos.coverPhotoIndex || 0);
  const [customUrl, setCustomUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<UploadTab>('device');

  // Refs for hidden file inputs
  const deviceFileRef = useRef<HTMLInputElement>(null);
  const cameraFileRef = useRef<HTMLInputElement>(null);

  // Convert File to data URL and add to list
  const handleFileSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (photoList.length >= 5) {
      toast.error('Free tier allows a maximum of 5 photos. Upgrade to Premium for unlimited photos!');
      return;
    }

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`"${file.name}" is not an image file.`);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`"${file.name}" is too large. Max file size is 10 MB.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setPhotoList((prev) => {
          if (prev.length >= 5) {
            toast.error('Maximum 5 photos reached.');
            return prev;
          }
          toast.success(`Photo "${file.name}" added!`);
          return [...prev, dataUrl];
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddCustomUrl = () => {
    if (!customUrl || !customUrl.startsWith('http')) {
      toast.error('Please enter a valid image URL starting with http');
      return;
    }
    if (photoList.length >= 5) {
      toast.error('Free tier allows a maximum of 5 photos. Upgrade to Premium for unlimited photos!');
      return;
    }
    setPhotoList([...photoList, customUrl]);
    setCustomUrl('');
    toast.success('Photo URL added!');
  };

  const handleAddPreset = (url: string) => {
    if (photoList.includes(url)) {
      toast.error('Photo already added');
      return;
    }
    if (photoList.length >= 5) {
      toast.error('Free tier allows a maximum of 5 photos. Upgrade to Premium for unlimited photos!');
      return;
    }
    setPhotoList([...photoList, url]);
    toast.success('Photo added from gallery');
  };

  const handleDeletePhoto = (index: number) => {
    const updated = photoList.filter((_, i) => i !== index);
    setPhotoList(updated);
    if (coverIndex === index) {
      setCoverIndex(0);
    } else if (coverIndex > index) {
      setCoverIndex(coverIndex - 1);
    }
  };

  const handleSetCover = (index: number) => {
    setCoverIndex(index);
    toast.success('Cover photo updated!');
  };

  const handleNext = () => {
    if (photoList.length === 0) {
      toast.error('Please add at least 1 photo of your gym');
      return;
    }
    updatePhotos({ photos: photoList, coverPhotoIndex: coverIndex });
    nextStep();
  };

  const TABS: { id: UploadTab; label: string; icon: React.ReactNode }[] = [
    { id: 'device', label: 'Upload from Device', icon: <FolderOpen className="w-4 h-4" /> },
    { id: 'camera', label: 'Take Photo', icon: <Camera className="w-4 h-4" /> },
    { id: 'url', label: 'Paste URL', icon: <Link2 className="w-4 h-4" /> },
  ];

  return (
    <Card className="bg-[#161626] border-white/10 text-white">
      <CardContent className="p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#FF5722]/10 text-[#FF5722] rounded-xl">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-syne font-bold">Step 3 — Gym Photos</h2>
              <p className="text-xs text-gray-400">Upload photos of your gym floor, equipment, and amenities</p>
            </div>
          </div>
          <Badge className="bg-[#FF5722]/20 text-[#FF5722] border-[#FF5722]/40 font-medium gap-1.5 px-3 py-1">
            <Sparkles className="w-3.5 h-3.5" /> Free Tier: {photoList.length}/5 Photos
          </Badge>
        </div>

        {/* Upload Method Tabs */}
        <div className="p-6 rounded-2xl bg-white/5 border border-dashed border-white/20 space-y-5">
          <div className="flex items-center justify-center gap-2 p-1.5 bg-[#1A1A2E] rounded-xl border border-white/10 w-fit mx-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#FF5722] text-white shadow-lg shadow-[#FF5722]/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab: Upload from Device */}
          {activeTab === 'device' && (
            <div className="flex flex-col items-center gap-4">
              {/* Hidden input accepts multiple image files */}
              <input
                ref={deviceFileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFileSelected(e.target.files)}
              />
              <div className="mx-auto p-4 rounded-full bg-[#FF5722]/10 w-fit text-[#FF5722]">
                <FolderOpen className="w-8 h-8" />
              </div>
              <div className="text-center space-y-1">
                <p className="font-semibold text-white">Select photos from your device</p>
                <p className="text-xs text-gray-400">Supports JPG, PNG, WEBP · Max 10 MB per photo</p>
              </div>
              <Button
                type="button"
                onClick={() => deviceFileRef.current?.click()}
                disabled={photoList.length >= 5}
                className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold h-11 px-8 text-sm flex items-center gap-2 shadow-lg shadow-[#FF5722]/30"
              >
                <Upload className="w-4 h-4" /> Choose Photos from Device
              </Button>
            </div>
          )}

          {/* Tab: Take Photo (Camera) */}
          {activeTab === 'camera' && (
            <div className="flex flex-col items-center gap-4">
              {/* Hidden input with camera capture */}
              <input
                ref={cameraFileRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => handleFileSelected(e.target.files)}
              />
              <div className="mx-auto p-4 rounded-full bg-emerald-500/10 w-fit text-emerald-400">
                <Camera className="w-8 h-8" />
              </div>
              <div className="text-center space-y-1">
                <p className="font-semibold text-white">Take a photo with your camera</p>
                <p className="text-xs text-gray-400">Opens your phone or laptop camera to snap a live photo of your gym</p>
              </div>
              <Button
                type="button"
                onClick={() => cameraFileRef.current?.click()}
                disabled={photoList.length >= 5}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 px-8 text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30"
              >
                <Camera className="w-4 h-4" /> Open Camera & Take Photo
              </Button>
            </div>
          )}

          {/* Tab: Paste URL */}
          {activeTab === 'url' && (
            <div className="flex flex-col items-center gap-4">
              <div className="mx-auto p-4 rounded-full bg-blue-500/10 w-fit text-blue-400">
                <Link2 className="w-8 h-8" />
              </div>
              <div className="text-center space-y-1">
                <p className="font-semibold text-white">Paste an image URL</p>
                <p className="text-xs text-gray-400">From Cloudinary, Unsplash, Google Drive, or any direct image link</p>
              </div>
              <div className="flex gap-2 w-full max-w-md">
                <Input
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://your-image-url.jpg"
                  className="h-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 text-xs"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCustomUrl()}
                />
                <Button
                  type="button"
                  onClick={handleAddCustomUrl}
                  disabled={photoList.length >= 5}
                  className="h-10 bg-[#FF5722] hover:bg-[#FF5722]/90 text-white px-4 text-xs font-semibold shrink-0"
                >
                  Add URL
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sample Stock Photos Quick Selector */}
        <div className="space-y-2">
          <Label className="text-gray-400 text-xs uppercase tracking-wider">Quick Sample Stock Photos</Label>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {SAMPLE_PRESETS.map((url, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleAddPreset(url)}
                disabled={photoList.includes(url) || photoList.length >= 5}
                className="relative w-20 h-16 rounded-lg overflow-hidden border border-white/10 shrink-0 group disabled:opacity-40"
              >
                <Image src={url} alt={`Preset ${i}`} fill className="object-cover group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus className="w-5 h-5 text-white" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Uploaded Photos Grid */}
        <div className="space-y-2">
          <Label className="text-gray-300 text-sm font-medium">Your Selected Gym Photos ({photoList.length}/5)</Label>
          {photoList.length === 0 ? (
            <div className="p-8 text-center border border-white/10 rounded-xl text-gray-500 text-sm">
              No photos added yet. Use the options above or click a sample thumbnail.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photoList.map((url, index) => (
                <div
                  key={index}
                  className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all group ${
                    coverIndex === index ? 'border-[#FF5722] shadow-lg shadow-[#FF5722]/20' : 'border-white/10'
                  }`}
                >
                  <Image src={url} alt={`Gym Photo ${index + 1}`} fill className="object-cover" />

                  {coverIndex === index && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#FF5722] text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Star className="w-3 h-3 fill-white" /> Cover
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {coverIndex !== index && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleSetCover(index)}
                        className="h-8 text-xs bg-white/20 hover:bg-[#FF5722] text-white"
                      >
                        Set Cover
                      </Button>
                    )}
                    <Button
                      type="button"
                      size="icon"
                      onClick={() => handleDeletePhoto(index)}
                      className="h-8 w-8 bg-red-600/80 hover:bg-red-600 text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upgrade Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#FF5722]/10 to-purple-500/10 border border-[#FF5722]/30 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FF5722]" /> Want Unlimited Photos & 4K Video Tour?
            </h4>
            <p className="text-xs text-gray-400">Upgrade to GymSpot Premium to showcase unlimited photos and gym walkthrough videos.</p>
          </div>
          <Button variant="outline" className="border-[#FF5722] text-[#FF5722] hover:bg-[#FF5722]/10 text-xs shrink-0">
            Learn Premium
          </Button>
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
            Next: Plans & Details <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

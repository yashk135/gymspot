'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useListingForm } from '@/hooks/useListingForm';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { TrainerItem } from '@/lib/validators';
import {
  Users,
  Plus,
  Trash2,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  MapPin,
  Clock,
  Sparkles,
  Phone,
  Mail,
  Building2,
} from 'lucide-react';
import { toast } from 'sonner';

export function Step5TrainersAndReviewComponent() {
  const { user } = useAuth();
  const supabase = createClient();
  const { basicInfo, location, photos, details, trainers: trainerData, updateTrainers, prevStep, resetForm } = useListingForm();

  const [trainers, setTrainers] = useState<TrainerItem[]>(
    trainerData.trainers && trainerData.trainers.length > 0 ? trainerData.trainers : []
  );

  // New trainer inputs
  const [tName, setTName] = useState('');
  const [tSpec, setTSpec] = useState('');
  const [tExp, setTExp] = useState(3);
  const [tBio, setTBio] = useState('');
  const [tPhoto, setTPhoto] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleAddTrainer = () => {
    if (!tName || !tSpec) {
      toast.error('Trainer name and specialization are required');
      return;
    }
    const newTrainer: TrainerItem = {
      name: tName,
      specialization: tSpec,
      experienceYears: tExp,
      bio: tBio,
      photoUrl: tPhoto || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
    };
    const updated = [...trainers, newTrainer];
    setTrainers(updated);
    updateTrainers({ trainers: updated });
    setTName('');
    setTSpec('');
    setTBio('');
    setTPhoto('');
    toast.success('Trainer profile added!');
  };

  const handleDeleteTrainer = (index: number) => {
    const updated = trainers.filter((_, i) => i !== index);
    setTrainers(updated);
    updateTrainers({ trainers: updated });
  };

  const handleSubmitListing = async () => {
    if (!user) {
      toast.error('Please log in to submit your gym listing');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Insert GYM
      const { data: gymData, error: gymErr } = await (supabase.from('gyms') as any)
        .insert({
          owner_id: user.id,
          name: basicInfo.name,
          description: basicInfo.description,
          address: basicInfo.address,
          country: basicInfo.country || 'India',
          lat: location.lat || 19.076,
          lng: location.lng || 72.8777,
          phone: basicInfo.phone,
          email: basicInfo.email,
          gym_type: basicInfo.gymType || 'General',
          gender_type: basicInfo.genderType || 'Co-ed',
          status: 'pending',
          is_verified: false,
          is_featured: false,
        })
        .select()
        .single();

      if (gymErr) throw gymErr;
      const gymId = gymData.id;

      // 2. Insert Photos
      if (photos.photos && photos.photos.length > 0) {
        const photoInserts = photos.photos.map((url, idx) => ({
          gym_id: gymId,
          url,
          is_video: false,
          order_index: idx,
        }));
        await (supabase.from('gym_photos') as any).insert(photoInserts);
      }

      // 3. Insert Timings
      if (details.timings && details.timings.length > 0) {
        const timingInserts = details.timings.map((t) => ({
          gym_id: gymId,
          day_of_week: t.dayOfWeek,
          open_time: t.openTime,
          close_time: t.closeTime,
          is_closed: t.isClosed,
          is_24x7: details.is24x7 || false,
        }));
        await (supabase.from('gym_timings') as any).insert(timingInserts);
      }

      // 4. Insert Amenities
      if (details.amenities && details.amenities.length > 0) {
        const amenityInserts = details.amenities.map((a) => ({
          gym_id: gymId,
          amenity_name: a,
        }));
        await (supabase.from('gym_amenities') as any).insert(amenityInserts);
      }

      // 5. Insert Membership Plans
      if (details.plans && details.plans.length > 0) {
        const planInserts = details.plans.map((p) => ({
          gym_id: gymId,
          plan_name: p.planName,
          duration_days: p.durationDays,
          price: p.price,
          currency: p.currency,
          features: p.features,
          is_active: true,
        }));
        await (supabase.from('membership_plans') as any).insert(planInserts);
      }

      // 6. Insert Trainers
      if (trainers.length > 0) {
        const trainerInserts = trainers.map((tr) => ({
          gym_id: gymId,
          name: tr.name,
          photo_url: tr.photoUrl,
          specialization: tr.specialization,
          experience_years: tr.experienceYears,
          bio: tr.bio,
        }));
        await (supabase.from('trainers') as any).insert(trainerInserts);
      }

      setSubmitting(false);
      setSubmitted(true);
      resetForm();
      toast.success('Gym listing submitted for verification!');
    } catch (err: any) {
      setSubmitting(false);
      toast.error(err.message || 'Failed to submit listing');
    }
  };

  if (submitted) {
    return (
      <Card className="bg-[#161626] border-white/10 text-white text-center p-8 space-y-6">
        <div className="mx-auto p-4 bg-[#4CAF50]/10 text-[#4CAF50] rounded-full w-fit">
          <CheckCircle2 className="w-16 h-16" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-syne font-bold">Listing Submitted Successfully!</h2>
          <p className="text-gray-300 max-w-md mx-auto text-sm">
            Your gym <span className="text-[#FF5722] font-semibold">{basicInfo.name}</span> is currently under review by our moderation team. You will receive an email notification within 24 hours.
          </p>
        </div>
        <Badge className="bg-[#4CAF50]/20 text-[#4CAF50] border-[#4CAF50]/40 px-4 py-1 text-xs">
          Status: Pending Verification
        </Badge>
        <div className="pt-4">
          <Button
            onClick={() => (window.location.href = '/owner/dashboard')}
            className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white px-8 h-11 font-semibold"
          >
            Go to Owner Dashboard
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-[#161626] border-white/10 text-white">
      <CardContent className="p-6 md:p-8 space-y-8">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="p-2.5 bg-[#FF5722]/10 text-[#FF5722] rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-syne font-bold">Step 5 — Trainers & Final Review</h2>
            <p className="text-xs text-gray-400">Add trainer profiles and review your full listing before submission</p>
          </div>
        </div>

        {/* SECTION 1: Trainer Profiles */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-[#FF5722]" /> Trainer Profiles (Optional)
          </h3>

          {trainers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {trainers.map((tr, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 relative">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white/20">
                    <Image src={tr.photoUrl || ''} alt={tr.name} fill className="object-cover" />
                  </div>
                  <div className="truncate flex-1">
                    <h4 className="font-semibold text-sm text-white">{tr.name}</h4>
                    <p className="text-xs text-[#FF5722]">{tr.specialization} · {tr.experienceYears} yrs exp</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteTrainer(idx)}
                    className="text-gray-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Trainer Form */}
          <div className="p-4 rounded-xl bg-white/5 border border-dashed border-white/20 space-y-3">
            <h4 className="text-xs font-semibold text-gray-300 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5 text-[#FF5722]" /> Add Trainer Profile
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                value={tName}
                onChange={(e) => setTName(e.target.value)}
                placeholder="Trainer Full Name"
                className="h-10 bg-white/5 border-white/10 text-white text-xs"
              />
              <Input
                value={tSpec}
                onChange={(e) => setTSpec(e.target.value)}
                placeholder="Specialization (e.g. CrossFit)"
                className="h-10 bg-white/5 border-white/10 text-white text-xs"
              />
              <Input
                type="number"
                value={tExp}
                onChange={(e) => setTExp(Number(e.target.value))}
                placeholder="Years of Experience"
                className="h-10 bg-white/5 border-white/10 text-white text-xs"
              />
            </div>
            <Button
              type="button"
              onClick={handleAddTrainer}
              className="bg-white/10 hover:bg-white/20 text-white text-xs"
            >
              Add Trainer
            </Button>
          </div>
        </div>

        {/* SECTION 2: Final Listing Summary Card */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF5722]" /> Full Listing Summary Review
          </h3>

          <div className="p-5 rounded-2xl bg-[#1A1A2E] border border-white/10 space-y-4">
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-bold text-white font-syne">{basicInfo.name || 'Gym Name'}</h4>
                  <Badge className="bg-[#FF5722]/20 text-[#FF5722] text-[10px]">{basicInfo.gymType}</Badge>
                </div>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#FF5722]" /> {basicInfo.address}, {basicInfo.city}, {basicInfo.country}
                </p>
              </div>

              <div className="text-right text-xs text-gray-400">
                <p className="flex items-center gap-1 justify-end">
                  <Phone className="w-3 h-3 text-[#FF5722]" /> {basicInfo.phone}
                </p>
                <p className="flex items-center gap-1 justify-end mt-0.5">
                  <Mail className="w-3 h-3 text-[#FF5722]" /> {basicInfo.email}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">{basicInfo.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-white/10 text-xs text-gray-300">
              <div>
                <span className="text-gray-500">Gender Policy:</span> <p className="font-semibold text-white">{basicInfo.genderType}</p>
              </div>
              <div>
                <span className="text-gray-500">Photos Uploaded:</span> <p className="font-semibold text-white">{photos.photos?.length || 0} photos</p>
              </div>
              <div>
                <span className="text-gray-500">Membership Plans:</span> <p className="font-semibold text-white">{details.plans?.length || 0} plans</p>
              </div>
              <div>
                <span className="text-gray-500">Amenities Selected:</span> <p className="font-semibold text-white">{details.amenities?.length || 0} items</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation & Submit Buttons */}
        <div className="flex justify-between pt-4 border-t border-white/10">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={submitting}
            className="h-11 px-6 border-white/10 text-white hover:bg-white/5 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          <Button
            type="button"
            onClick={handleSubmitListing}
            disabled={submitting}
            className="h-11 px-8 bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-semibold flex items-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Submitting Listing...
              </>
            ) : (
              <>
                <Building2 className="w-4 h-4" /> Submit Gym Listing
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

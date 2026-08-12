'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1BasicInfoSchema, Step1BasicInfo } from '@/lib/validators';
import { useListingForm } from '@/hooks/useListingForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dumbbell, ArrowRight, Building2, MapPin, Globe, Phone, Mail } from 'lucide-react';

const GYM_TYPES = ['General', 'CrossFit', 'Powerlifting', 'MMA', 'Yoga', 'Zumba', 'Mixed'] as const;
const GENDER_POLICIES = ['Co-ed', 'Ladies Only', 'Men Only'] as const;

export function Step1BasicInfoComponent() {
  const { basicInfo, updateBasicInfo, nextStep } = useListingForm();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Step1BasicInfo>({
    resolver: zodResolver(step1BasicInfoSchema),
    defaultValues: {
      name: basicInfo.name || '',
      tagline: basicInfo.tagline || '',
      description: basicInfo.description || '',
      country: basicInfo.country || 'India',
      address: basicInfo.address || '',
      city: basicInfo.city || '',
      phone: basicInfo.phone || '',
      email: basicInfo.email || '',
      website: basicInfo.website || '',
      gymType: basicInfo.gymType || 'General',
      genderType: basicInfo.genderType || 'Co-ed',
    },
  });

  const selectedGymType = watch('gymType');
  const selectedGenderType = watch('genderType');

  const onSubmit = (data: Step1BasicInfo) => {
    updateBasicInfo(data);
    nextStep();
  };

  return (
    <Card className="bg-[#161626] border-white/10 text-white">
      <CardContent className="p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="p-2.5 bg-[#FF5722]/10 text-[#FF5722] rounded-xl">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-syne font-bold">Step 1 — Basic Information</h2>
            <p className="text-xs text-gray-400">Tell users about your gym name, location, and focus</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Gym Name & Tagline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300 text-sm">Gym Name *</Label>
              <Input
                {...register('name')}
                placeholder="e.g. Gold's Gym — Andheri West"
                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
              {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300 text-sm">Tagline (optional)</Label>
              <Input
                {...register('tagline')}
                placeholder="e.g. Mumbai's premier 24/7 fitness club"
                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-gray-300 text-sm">Full Description *</Label>
            <textarea
              {...register('description')}
              rows={4}
              placeholder="Describe your gym facilities, trainers, community atmosphere, and what makes your gym special..."
              className="w-full rounded-md bg-white/5 border border-white/10 text-white placeholder:text-gray-500 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
            />
            {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
          </div>

          {/* Location & Address */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300 text-sm flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Country *
              </Label>
              <select
                {...register('country')}
                className="w-full h-11 rounded-md bg-white/5 border border-white/10 text-white text-sm px-3 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
              >
                <option value="India">🇮🇳 India</option>
                <option value="United States">🇺🇸 United States</option>
                <option value="United Kingdom">🇬🇧 United Kingdom</option>
                <option value="United Arab Emirates">🇦🇪 United Arab Emirates</option>
                <option value="Australia">🇦🇺 Australia</option>
                <option value="Singapore">🇸🇬 Singapore</option>
                <option value="Germany">🇩🇪 Germany</option>
                <option value="Canada">🇨🇦 Canada</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300 text-sm flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> City *
              </Label>
              <Input
                {...register('city')}
                placeholder="e.g. Mumbai"
                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
              {errors.city && <p className="text-xs text-red-400">{errors.city.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-1">
              <Label className="text-gray-300 text-sm">Full Street Address *</Label>
              <Input
                {...register('address')}
                placeholder="e.g. Veera Desai Road, Near Fun Republic"
                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
              {errors.address && <p className="text-xs text-red-400">{errors.address.message}</p>}
            </div>
          </div>

          {/* Phone, Email, Website */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300 text-sm flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> Phone Number *
              </Label>
              <Input
                {...register('phone')}
                placeholder="+91 98765 43210"
                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
              {errors.phone && <p className="text-xs text-red-400">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300 text-sm flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email Address *
              </Label>
              <Input
                {...register('email')}
                type="email"
                placeholder="gym@example.com"
                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
              {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300 text-sm">Website (optional)</Label>
              <Input
                {...register('website')}
                placeholder="https://..."
                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
              {errors.website && <p className="text-xs text-red-400">{errors.website.message}</p>}
            </div>
          </div>

          {/* Gym Type Selector */}
          <div className="space-y-2 pt-2">
            <Label className="text-gray-300 text-sm">Gym Type *</Label>
            <div className="flex flex-wrap gap-2">
              {GYM_TYPES.map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setValue('gymType', type)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedGymType === type
                      ? 'bg-[#FF5722] text-white shadow-lg shadow-[#FF5722]/20'
                      : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Gender Policy Selector */}
          <div className="space-y-2 pt-2">
            <Label className="text-gray-300 text-sm">Gender Policy *</Label>
            <div className="flex gap-3">
              {GENDER_POLICIES.map((policy) => (
                <button
                  type="button"
                  key={policy}
                  onClick={() => setValue('genderType', policy)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedGenderType === policy
                      ? 'bg-[#FF5722] text-white shadow-lg shadow-[#FF5722]/20'
                      : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {policy}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end pt-4 border-t border-white/10">
            <Button
              type="submit"
              className="h-11 px-8 bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-semibold flex items-center gap-2"
            >
              Next: Location Pin <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

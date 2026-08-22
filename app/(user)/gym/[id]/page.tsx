'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { GymGallery } from '@/components/gym/detail/GymGallery';
import { FreeTrialModal } from '@/components/gym/detail/FreeTrialModal';
import { MembershipCheckoutModal } from '@/components/gym/detail/MembershipCheckoutModal';
import { CompareFloatingBar } from '@/components/shared/CompareFloatingBar';
import { useCompareStore } from '@/hooks/useCompare';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Star,
  MapPin,
  Heart,
  Scale,
  Ticket,
  MessageSquare,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Zap,
  Users,
  Check,
  Sparkles,
  Loader2,
  Share2,
  CreditCard,
} from 'lucide-react';
import { toast } from 'sonner';

export default function GymDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [gym, setGym] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  const { addGymToCompare, isInCompare, removeGymFromCompare } = useCompareStore();

  useEffect(() => {
    async function fetchGymDetails() {
      try {
        const res = await fetch(`/api/gyms/${id}`);
        const data = await res.json();
        let gymData = data.gym;

        // Merge any owner overrides saved from the Edit Listing page
        try {
          const overrides = JSON.parse(localStorage.getItem('gymspot_overrides') || '{}');
          if (overrides[id]) {
            gymData = { ...gymData, ...overrides[id] };
          }
        } catch {}

        setGym(gymData);
      } catch {
        toast.error('Failed to load gym details');
      } finally {
        setLoading(false);
      }
    }
    fetchGymDetails();

    // Listen for real-time updates from the owner edit page (same device, different tab)
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('gymspot_gym_updates');
      bc.onmessage = (event) => {
        if (event.data?.gymId === id) {
          setGym((prev: any) => prev ? { ...prev, ...event.data } : prev);
          toast.success('🔄 Gym details updated by owner in real-time!');
        }
      };
    } catch {}

    return () => {
      try { bc?.close(); } catch {}
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1A2E] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF5722]" />
      </div>
    );
  }

  if (!gym) {
    return (
      <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-col justify-between">
        <Navbar />
        <div className="p-12 text-center space-y-4">
          <h2 className="text-2xl font-bold">Gym Not Found</h2>
          <Link href="/">
            <Button className="bg-[#FF5722]">Return to Home</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isCompared = isInCompare(gym.id);

  const handleToggleCompare = () => {
    if (isCompared) {
      removeGymFromCompare(gym.id);
    } else {
      addGymToCompare({
        id: gym.id,
        name: gym.name,
        address: gym.address,
        lat: gym.lat,
        lng: gym.lng,
        gym_type: gym.gym_type,
        gender_type: gym.gender_type,
        is_verified: gym.is_verified,
        total_rating: gym.total_rating,
        rating_count: gym.rating_count,
        starting_price: gym.starting_price,
        currency: gym.currency,
        cover_photo: gym.cover_photo,
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: gym.name,
        text: `Check out ${gym.name} on GymSpot!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ExerciseGym',
    name: gym.name,
    description: gym.description,
    address: gym.address,
    telephone: gym.phone,
    email: gym.email,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: gym.lat,
      longitude: gym.lng,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: gym.total_rating,
      reviewCount: gym.rating_count,
    },
    image: gym.cover_photo,
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-col selection:bg-[#FF5722] selection:text-white">
      {/* SEO JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">
        {/* Photo Gallery Carousel */}
        <GymGallery photos={gym.photos} gymName={gym.name} />

        {/* HEADER SECTION */}
        <div className="bg-[#161626] border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-extrabold font-syne text-white">{gym.name}</h1>
                {gym.is_verified && (
                  <Badge className="bg-[#FF5722]/20 text-[#FF5722] border-[#FF5722]/40 gap-1 px-2.5 py-0.5">
                    <ShieldCheck className="w-4 h-4" /> Verified Gym
                  </Badge>
                )}
                <Badge variant="outline" className="border-white/20 text-gray-300">
                  {gym.gym_type}
                </Badge>
                <Badge variant="outline" className="border-white/20 text-gray-300">
                  {gym.gender_type}
                </Badge>
              </div>

              <p className="text-xs text-gray-400 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#FF5722] shrink-0" /> {gym.address}
              </p>

              <div className="flex items-center gap-4 text-xs pt-1">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{gym.total_rating.toFixed(1)}</span>
                  <span className="text-gray-400 font-normal">({gym.rating_count} reviews)</span>
                </div>
                <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                  ● Open Now (06:00 - 23:00)
                </span>
              </div>
            </div>

            {/* Price Highlight */}
            <div className="text-left md:text-right shrink-0">
              <span className="text-xs text-gray-400 uppercase tracking-wider block">Starting Membership</span>
              <p className="text-3xl font-extrabold text-white font-syne">
                {gym.currency === 'INR' ? '₹' : '$'}{(gym.starting_price ?? 0).toLocaleString()}
                <span className="text-sm text-gray-400 font-normal">/mo</span>
              </p>
            </div>
          </div>

          {/* ACTION BUTTONS ROW */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Free Trial Button */}
            <Button
              onClick={() => setTrialModalOpen(true)}
              className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold h-11 px-6 text-sm shadow-lg shadow-[#FF5722]/30 flex items-center gap-2"
            >
              <Ticket className="w-4 h-4" /> 1-Click Free Trial
            </Button>

            {/* FEATURE 3: Buy Membership Button */}
            <Button
              onClick={() => setCheckoutModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 px-6 text-sm shadow-lg shadow-emerald-600/30 flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" /> Buy Membership
            </Button>

            {/* Compare Button */}
            <Button
              onClick={handleToggleCompare}
              variant="outline"
              className={`h-11 px-5 text-sm font-semibold flex items-center gap-2 border ${
                isCompared
                  ? 'bg-[#FF5722]/20 border-[#FF5722] text-white'
                  : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <Scale className="w-4 h-4 text-[#FF5722]" /> {isCompared ? 'In Compare List' : 'Compare'}
            </Button>

            {/* Bookmark */}
            <Button
              onClick={() => {
                setSaved(!saved);
                toast(saved ? 'Removed from saved gyms' : 'Saved gym to bookmarks!');
              }}
              variant="outline"
              className="h-11 border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
            >
              <Heart className={`w-4 h-4 ${saved ? 'text-[#FF5722] fill-[#FF5722]' : ''}`} />
            </Button>

            {/* WhatsApp */}
            <a href={`https://wa.me/${gym.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="h-11 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 gap-2">
                <MessageSquare className="w-4 h-4" /> WhatsApp
              </Button>
            </a>

            {/* Call */}
            <a href={`tel:${gym.phone}`}>
              <Button variant="outline" className="h-11 border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 gap-2">
                <Phone className="w-4 h-4 text-[#FF5722]" /> Call
              </Button>
            </a>

            {/* Share */}
            <Button onClick={handleShare} variant="ghost" size="icon" className="h-11 w-11 text-gray-400 hover:text-white">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Active Deals Banner */}
        {gym.deals && gym.deals.length > 0 && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#FF5722]/20 via-[#161626] to-purple-500/20 border border-[#FF5722]/40 space-y-2 relative overflow-hidden">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <Badge className="bg-[#FF5722] text-white font-extrabold px-3 py-1">
                <Zap className="w-3.5 h-3.5 mr-1" /> {gym.deals[0].discount_percent}% OFF EXCLUSIVE DEAL
              </Badge>
              <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Limited Time Deal
              </span>
            </div>
            <h3 className="text-lg font-bold text-white font-syne">{gym.deals[0].title}</h3>
            <p className="text-xs text-gray-300">{gym.deals[0].description}</p>
          </div>
        )}

        {/* MAIN GRID: Left (Details, Plans, Amenities) / Right (Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card className="bg-[#161626] border-white/10 text-white">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold font-syne text-white border-b border-white/10 pb-3">
                  About {gym.name}
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">{gym.description}</p>

                {/* Day-Wise Timings Table */}
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#FF5722]" /> Operating Hours
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {gym.timings?.map((t: any, idx: number) => (
                      <div key={idx} className="flex justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                        <span className="text-gray-300 font-medium">{t.dayName}</span>
                        <span className="text-white">
                          {t.is_closed ? <span className="text-red-400 font-semibold">Closed</span> : `${t.open_time} - ${t.close_time}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verified Membership Plans Section */}
            <Card className="bg-[#161626] border-white/10 text-white">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-lg font-bold font-syne text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#FF5722]" /> Verified Membership Plans
                  </h3>
                  <Badge className="bg-[#FF5722]/20 text-[#FF5722] text-[10px]">Public Pricing</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gym.plans?.map((plan: any) => (
                    <div
                      key={plan.id}
                      className={`p-5 rounded-2xl border transition-all relative space-y-4 ${
                        plan.is_best_value
                          ? 'bg-gradient-to-br from-[#FF5722]/15 to-[#161626] border-[#FF5722] shadow-xl shadow-[#FF5722]/10'
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      {plan.is_best_value && (
                        <Badge className="absolute -top-3 right-4 bg-[#FF5722] text-white font-extrabold text-[10px] uppercase tracking-wider">
                          ★ Best Value Plan
                        </Badge>
                      )}
                      <div>
                        <h4 className="font-bold text-lg text-white font-syne">{plan.plan_name}</h4>
                        <p className="text-2xl font-extrabold text-[#FF5722] mt-1">
                          {plan.currency === 'INR' ? '₹' : '$'}{(plan.price ?? 0).toLocaleString()}
                          <span className="text-xs text-gray-400 font-normal"> / {plan.duration_days} days</span>
                        </p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-white/10">
                        <p className="text-xs font-semibold text-gray-300">What&apos;s Included:</p>
                        <ul className="space-y-1.5 text-xs text-gray-300">
                          {plan.features?.map((feat: string, i: number) => (
                            <li key={i} className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button
                        onClick={() => setCheckoutModalOpen(true)}
                        className={`w-full text-xs font-bold h-10 ${
                          plan.is_best_value
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        Buy This Membership
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Amenities & Equipment Grid */}
            <Card className="bg-[#161626] border-white/10 text-white">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-bold font-syne text-white border-b border-white/10 pb-3">
                    Gym Amenities ({gym.amenities?.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                    {gym.amenities?.map((amenity: string, i: number) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-200 flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#FF5722] shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Equipment List */}
                {gym.equipment && (
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
                      Featured Gym Equipment
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {gym.equipment.map((eq: string, i: number) => (
                        <Badge key={i} variant="outline" className="border-white/15 bg-white/5 text-gray-300 text-xs px-3 py-1">
                          🏋️ {eq}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Trainers Section */}
            {gym.trainers && gym.trainers.length > 0 && (
              <Card className="bg-[#161626] border-white/10 text-white">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-bold font-syne text-white flex items-center gap-2 border-b border-white/10 pb-3">
                    <Users className="w-5 h-5 text-[#FF5722]" /> Certified Personal Trainers
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {gym.trainers.map((tr: any) => (
                      <div key={tr.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex gap-4 items-start">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/20">
                          <Image src={tr.photo_url} alt={tr.name} fill className="object-cover" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-white text-sm">{tr.name}</h4>
                          <p className="text-xs text-[#FF5722] font-semibold">{tr.specialization}</p>
                          <span className="text-[11px] text-gray-400 block">{tr.experience_years} years experience</span>
                          <p className="text-xs text-gray-300 line-clamp-2 pt-1">{tr.bio}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews Section */}
            <Card className="bg-[#161626] border-white/10 text-white">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-lg font-bold font-syne text-white">Member Reviews & Feedback</h3>
                    <p className="text-xs text-gray-400">Based on verified gym trial visits</p>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-white font-syne">{gym.total_rating.toFixed(1)}</span>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-4">
                  {gym.reviews?.map((rev: any) => (
                    <div key={rev.id} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm text-white">{rev.user_name}</span>
                        <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{rev.rating}/5</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">&ldquo;{rev.comment}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDEBAR: Quick Booking & Location Map */}
          <div className="space-y-6">
            {/* Quick Free Trial Card */}
            <Card className="bg-[#161626] border-[#FF5722]/40 text-white shadow-xl shadow-[#FF5722]/10 sticky top-20">
              <CardContent className="p-6 space-y-5">
                <div className="space-y-1">
                  <Badge className="bg-[#FF5722] text-white font-extrabold text-[10px] uppercase">
                    1-Click Trial Pass
                  </Badge>
                  <h3 className="text-xl font-bold font-syne text-white">Try {gym.name} Free</h3>
                  <p className="text-xs text-gray-300">Book a 1-day complimentary workout pass with zero obligations.</p>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() => setTrialModalOpen(true)}
                    className="w-full h-11 bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold text-sm shadow-lg shadow-[#FF5722]/30 flex items-center justify-center gap-2"
                  >
                    <Ticket className="w-4 h-4" /> Book Free Trial Pass
                  </Button>

                  <Button
                    onClick={() => setCheckoutModalOpen(true)}
                    className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" /> Buy Membership Plan
                  </Button>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-gray-400">
                  <p className="flex items-center gap-2 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-4 h-4 shrink-0" /> Instant Owner Confirmation
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Full Gym Floor & Locker Access
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Free Personal Trainer Consultation
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Free Trial Sheet Modal */}
      <FreeTrialModal
        open={trialModalOpen}
        onOpenChange={setTrialModalOpen}
        gymId={gym.id}
        gymName={gym.name}
      />

      {/* Membership Checkout Modal */}
      <MembershipCheckoutModal
        open={checkoutModalOpen}
        onOpenChange={setCheckoutModalOpen}
        gymName={gym.name}
        plans={gym.plans || []}
      />

      {/* Floating Compare Bar */}
      <CompareFloatingBar />

      <Footer />
    </div>
  );
}

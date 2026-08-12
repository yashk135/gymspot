'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { useAuth } from '@/hooks/useAuth';
import { initiatePayment, PRICING_TIERS } from '@/lib/payments';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  Check,
  Building2,
  Zap,
  ShieldCheck,
  Globe,
  ArrowLeft,
  Loader2,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

const CURRENCIES = [
  { code: 'INR', symbol: '₹', flag: '🇮🇳' },
  { code: 'USD', symbol: '$', flag: '🇺🇸' },
  { code: 'GBP', symbol: '£', flag: '🇬🇧' },
  { code: 'EUR', symbol: '€', flag: '🇪🇺' },
  { code: 'AED', symbol: 'AED', flag: '🇦🇪' },
];

export default function PremiumUpgradePage() {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [currency, setCurrency] = useState<string>('INR');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const selectedCurr = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

  const getPriceDisplay = (tier: 'pro' | 'featured') => {
    const data = PRICING_TIERS[tier];
    const priceObj = billingCycle === 'annual' ? data.annualPrice : data.monthlyPrice;
    const amount = (priceObj as any)[currency] || priceObj.INR;
    return `${selectedCurr.symbol} ${amount.toLocaleString()}`;
  };

  const handleCheckout = async (planId: 'pro' | 'featured') => {
    setLoadingPlan(planId);
    try {
      await initiatePayment({
        planId,
        billingCycle,
        currency,
        ownerEmail: user?.email || 'owner@gymspot.com',
        ownerName: user?.user_metadata?.name || 'Gym Owner',
      });
      toast.success(`Upgraded to ${planId.toUpperCase()} Tier successfully!`);
    } catch (err: any) {
      toast.error(err.message || 'Checkout error');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-col selection:bg-[#FF5722] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-12">
        {/* Header Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
          <div className="flex justify-center items-center gap-2">
            <Link href="/owner/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white gap-1 text-xs">
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
              </Button>
            </Link>
          </div>

          <Badge className="bg-[#FF5722]/20 text-[#FF5722] border-[#FF5722]/40 font-bold px-3 py-1 text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 mr-1" /> GymSpot Monetization Engine
          </Badge>

          <h1 className="text-4xl md:text-5xl font-extrabold font-syne text-white leading-tight">
            Grow Your Gym Membership <span className="text-[#FF5722]">3x Faster</span>
          </h1>

          <p className="text-gray-300 text-sm md:text-base max-w-xl mx-auto">
            Choose the right subscription tier for your gym. Get priority search rankings, unlimited photo galleries, discount deal banners, and top home screen placement.
          </p>

          {/* Billing Cycle Toggle & Currency Picker */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {/* Monthly / Annual Toggle */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#161626] border border-white/10">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  billingCycle === 'monthly' ? 'bg-[#FF5722] text-white shadow-lg shadow-[#FF5722]/30' : 'text-gray-400 hover:text-white'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  billingCycle === 'annual' ? 'bg-[#FF5722] text-white shadow-lg shadow-[#FF5722]/30' : 'text-gray-400 hover:text-white'
                }`}
              >
                Annual Billing <Badge className="bg-emerald-500 text-white text-[9px] font-extrabold px-1.5 py-0">Save 20%</Badge>
              </button>
            </div>

            {/* Currency Selector */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#161626] border border-white/10">
              <Globe className="w-4 h-4 text-gray-400 ml-2" />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent text-white text-xs font-bold focus:outline-none pr-2 cursor-pointer"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code} className="bg-[#161626]">
                    {c.flag} {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 3 PRICING TIER CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* TIER 1: Free Tier */}
          <Card className="bg-[#161626] border-white/10 text-white flex flex-col justify-between relative">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Badge variant="outline" className="border-white/20 text-gray-400 font-bold text-[10px] uppercase">
                  Basic Starter
                </Badge>
                <h3 className="text-2xl font-bold font-syne text-white">Free Listing</h3>
                <p className="text-xs text-gray-400">Essential gym profile for new listings</p>
                <p className="text-3xl font-extrabold text-white font-syne pt-2">
                  {selectedCurr.symbol} 0 <span className="text-xs text-gray-400 font-normal">/ forever</span>
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#FF5722] shrink-0" />
                  <span>1 Gym Listing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#FF5722] shrink-0" />
                  <span>Max 5 Photos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#FF5722] shrink-0" />
                  <span>Standard Search Placement</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 line-through">
                  <span>Deal & Discount Banners</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 line-through">
                  <span>Top Home Screen Featured Placement</span>
                </div>
              </div>
            </CardContent>

            <div className="p-6 pt-0">
              <Button disabled variant="outline" className="w-full border-white/10 text-gray-500 h-11 text-xs">
                Current Plan
              </Button>
            </div>
          </Card>

          {/* TIER 2: Pro Tier */}
          <Card className="bg-gradient-to-b from-[#161626] to-[#1A1A2E] border-[#FF5722]/50 text-white flex flex-col justify-between relative shadow-xl shadow-[#FF5722]/10">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Badge className="bg-[#FF5722] text-white font-bold text-[10px] uppercase">
                  Most Popular
                </Badge>
                <h3 className="text-2xl font-bold font-syne text-white">Pro Tier</h3>
                <p className="text-xs text-gray-400">For gyms wanting priority ranking & deal banners</p>
                <p className="text-3xl font-extrabold text-[#FF5722] font-syne pt-2">
                  {getPriceDisplay('pro')}
                  <span className="text-xs text-gray-400 font-normal"> / {billingCycle === 'annual' ? 'year' : 'month'}</span>
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10 text-xs text-gray-300">
                {PRICING_TIERS.pro.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </CardContent>

            <div className="p-6 pt-0">
              <Button
                onClick={() => handleCheckout('pro')}
                disabled={loadingPlan === 'pro'}
                className="w-full bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold h-11 text-xs shadow-lg shadow-[#FF5722]/30 flex items-center justify-center gap-2"
              >
                {loadingPlan === 'pro' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Zap className="w-4 h-4" /> Upgrade to Pro
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* TIER 3: Featured Tier */}
          <Card className="bg-gradient-to-b from-[#161626] to-purple-950/40 border-purple-500/50 text-white flex flex-col justify-between relative shadow-xl shadow-purple-500/10">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Badge className="bg-purple-600 text-white font-bold text-[10px] uppercase">
                  ★ Maximum Exposure
                </Badge>
                <h3 className="text-2xl font-bold font-syne text-white">Featured Tier</h3>
                <p className="text-xs text-gray-400">Top home screen placement + 3x trial guarantee</p>
                <p className="text-3xl font-extrabold text-purple-400 font-syne pt-2">
                  {getPriceDisplay('featured')}
                  <span className="text-xs text-gray-400 font-normal"> / {billingCycle === 'annual' ? 'year' : 'month'}</span>
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10 text-xs text-gray-300">
                {PRICING_TIERS.featured.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </CardContent>

            <div className="p-6 pt-0">
              <Button
                onClick={() => handleCheckout('featured')}
                disabled={loadingPlan === 'featured'}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold h-11 text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
              >
                {loadingPlan === 'featured' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Get Featured Placement
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

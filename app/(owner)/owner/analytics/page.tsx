'use client';

import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BarChart2 } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-col selection:bg-[#FF5722] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 space-y-8">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <Link href="/owner/dashboard">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5">
              ←
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-syne font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-6 h-6 text-[#FF5722]" /> Performance & Conversion Analytics
            </h1>
            <p className="text-sm text-gray-400">Track profile page views, trial request conversion rate, and peak inquiry hours</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-[#161626] border-white/10 text-white">
            <CardContent className="p-5 space-y-1">
              <span className="text-xs text-gray-400 font-semibold">Total Profile Views (30 Days)</span>
              <h3 className="text-3xl font-extrabold text-white font-syne">1,420</h3>
              <p className="text-xs text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +18.4% growth
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#161626] border-white/10 text-white">
            <CardContent className="p-5 space-y-1">
              <span className="text-xs text-gray-400 font-semibold">Trial Pass Conversion Rate</span>
              <h3 className="text-3xl font-extrabold text-[#FF5722] font-syne">2.68%</h3>
              <p className="text-xs text-gray-400">38 bookings from 1,420 views</p>
            </CardContent>
          </Card>

          <Card className="bg-[#161626] border-white/10 text-white">
            <CardContent className="p-5 space-y-1">
              <span className="text-xs text-gray-400 font-semibold">Peak Inquiry Hours</span>
              <h3 className="text-xl font-bold text-white font-syne">06:00 PM - 09:00 PM</h3>
              <p className="text-xs text-gray-400">72% of trials booked in evening</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-[#161626] border-white/10 text-white">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-base font-bold font-syne text-white border-b border-white/10 pb-3">
                Top Performing Membership Plans
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="font-semibold text-white">Annual VIP All-Access (₹28,000)</span>
                  <Badge className="bg-[#FF5722]/20 text-[#FF5722]">58% Clicks</Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="font-semibold text-white">Monthly General Pass (₹3,500)</span>
                  <Badge variant="outline" className="border-white/20 text-gray-300">27% Clicks</Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="font-semibold text-white">Quarterly Strength Pass (₹9,000)</span>
                  <Badge variant="outline" className="border-white/20 text-gray-300">15% Clicks</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#161626] border-white/10 text-white">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-base font-bold font-syne text-white border-b border-white/10 pb-3">
                Most Viewed Gym Photos
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="font-semibold text-white">Hammer Strength Weight Floor</span>
                  <span className="text-gray-400">842 views</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="font-semibold text-white">Steam & Sauna Room</span>
                  <span className="text-gray-400">519 views</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="font-semibold text-white">Turf Conditioning Zone</span>
                  <span className="text-gray-400">388 views</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

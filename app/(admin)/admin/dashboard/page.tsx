'use client';

import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ShieldCheck,
  Building2,
  Users,
  Ticket,
  DollarSign,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-col selection:bg-[#FF5722] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" /> Platform Superadmin Portal
            </div>
            <h1 className="text-3xl font-syne font-bold text-white">Platform Control Panel</h1>
            <p className="text-sm text-gray-400">Overview of GymSpot listings, verification queue, user accounts, and platform revenue</p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin/verifications">
              <Button className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold h-11 px-5 text-xs flex items-center gap-2 shadow-lg shadow-[#FF5722]/30">
                <Clock className="w-4 h-4" /> Verification Queue (3 Pending)
              </Button>
            </Link>
          </div>
        </div>

        {/* PLATFORM STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-[#161626] border-white/10 text-white">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Gyms Listed</p>
                <h3 className="text-3xl font-extrabold text-white font-syne mt-1">128</h3>
                <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">118 Approved · 3 Pending</span>
              </div>
              <div className="p-3 bg-[#FF5722]/10 text-[#FF5722] rounded-xl">
                <Building2 className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#161626] border-white/10 text-white">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Registered Users</p>
                <h3 className="text-3xl font-extrabold text-white font-syne mt-1">4,290</h3>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold mt-1">
                  <TrendingUp className="w-3 h-3" /> +14% this month
                </span>
              </div>
              <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#161626] border-white/10 text-white">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Free Trial Passes</p>
                <h3 className="text-3xl font-extrabold text-white font-syne mt-1">1,845</h3>
                <span className="text-[11px] text-gray-400 mt-1 block">Booked across platform</span>
              </div>
              <div className="p-3 bg-[#FF5722]/10 text-[#FF5722] rounded-xl">
                <Ticket className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#161626] border-white/10 text-white">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Platform Revenue</p>
                <h3 className="text-3xl font-extrabold text-white font-syne mt-1">₹4.8L</h3>
                <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">Premium owner subscriptions</span>
              </div>
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <DollarSign className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* QUICK NAVIGATION MODULES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-[#161626] border-white/10 text-white hover:border-[#FF5722]/40 transition-all">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-[#FF5722]/10 text-[#FF5722] rounded-xl">
                  <Clock className="w-6 h-6" />
                </div>
                <Badge className="bg-[#FF5722] text-white">3 Pending</Badge>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold font-syne text-white">Verification Queue</h3>
                <p className="text-xs text-gray-400">Inspect pending gym submissions, review photos & owner credentials, and approve or reject.</p>
              </div>
              <Link href="/admin/verifications">
                <Button className="w-full bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold text-xs h-10 flex items-center justify-center gap-1">
                  Open Verification Queue <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-[#161626] border-white/10 text-white hover:border-[#FF5722]/40 transition-all">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
                  <Building2 className="w-6 h-6" />
                </div>
                <Badge variant="outline" className="border-white/20 text-gray-300">128 Total</Badge>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold font-syne text-white">All Gyms Directory</h3>
                <p className="text-xs text-gray-400">Manage all registered gyms, toggle Featured/Boosted placement, and grant Verified badges.</p>
              </div>
              <Link href="/admin/gyms">
                <Button variant="outline" className="w-full border-white/10 text-white font-bold text-xs h-10 flex items-center justify-center gap-1 hover:bg-white/5">
                  Manage Gym Directory <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-[#161626] border-white/10 text-white hover:border-[#FF5722]/40 transition-all">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                  <Users className="w-6 h-6" />
                </div>
                <Badge variant="outline" className="border-white/20 text-gray-300">4,290 Users</Badge>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold font-syne text-white">Users & Owners</h3>
                <p className="text-xs text-gray-400">View user profiles, gym owner accounts, platform roles, and member activity records.</p>
              </div>
              <Link href="/admin/users">
                <Button variant="outline" className="w-full border-white/10 text-white font-bold text-xs h-10 flex items-center justify-center gap-1 hover:bg-white/5">
                  View User Accounts <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

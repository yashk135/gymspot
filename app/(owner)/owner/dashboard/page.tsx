'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Footer } from '@/components/shared/Footer';
import { QrScannerModal } from '@/components/owner/QrScannerModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Eye,
  Ticket,
  MessageSquare,
  Sparkles,
  Edit,
  Tag,
  Megaphone,
  TrendingUp,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Scan,
} from 'lucide-react';
import { toast } from 'sonner';

const SAMPLE_RECENT_TRIALS = [
  {
    id: 'tr-101',
    passCode: 'GS-892147',
    userName: 'Rahul Sharma',
    userPhone: '+91 98765 43210',
    visitDate: '2026-08-22',
    slot: 'Morning (06:00 - 10:00)',
    status: 'pending',
    createdAt: '10 mins ago',
  },
  {
    id: 'tr-102',
    passCode: 'GS-774102',
    userName: 'Ananya Verma',
    userPhone: '+91 98123 45678',
    visitDate: '2026-08-22',
    slot: 'Evening (17:00 - 21:00)',
    status: 'accepted',
    createdAt: '2 hours ago',
  },
  {
    id: 'tr-103',
    passCode: 'GS-551029',
    userName: 'Amit Patel',
    userPhone: '+91 97654 32109',
    visitDate: '2026-08-23',
    slot: 'Afternoon (12:00 - 16:00)',
    status: 'pending',
    createdAt: '5 hours ago',
  },
];

export default function OwnerDashboardPage() {
  const { user } = useAuth();
  const [trials, setTrials] = useState(SAMPLE_RECENT_TRIALS);
  const [scannerOpen, setScannerOpen] = useState(false);

  const handleUpdateStatus = (id: string, newStatus: 'accepted' | 'declined') => {
    setTrials(trials.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
    toast.success(`Trial request ${newStatus === 'accepted' ? 'accepted! Digital QR code generated for user.' : 'declined.'}`);
  };

  const handleCheckInSuccess = (passCode: string) => {
    setTrials(trials.map((t) => (t.passCode === passCode ? { ...t, status: 'accepted' } : t)));
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-col selection:bg-[#FF5722] selection:text-white">
      <header className="w-full h-16 border-b border-white/10 bg-[#161626] px-6 flex items-center justify-between sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2 font-syne font-extrabold text-xl text-white">
          <Building2 className="w-6 h-6 text-[#FF5722]" />
          Gym<span className="text-[#FF5722]">Spot</span> <span className="text-xs text-gray-400 font-normal">Owner Portal</span>
        </Link>

        <div className="flex items-center gap-3">
          <Badge className="bg-[#FF5722]/20 text-[#FF5722] border-[#FF5722]/40 font-medium">
            Free Plan (1 Gym)
          </Badge>
          <Link href="/owner/upgrade">
            <Button className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white text-xs font-bold h-9">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Upgrade Premium
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-syne font-bold text-white">
              Welcome Back, <span className="text-[#FF5722]">{user?.user_metadata?.name || 'Gym Owner'}</span>
            </h1>
            <p className="text-sm text-gray-400">Golds Gym — Andheri West · Status: <span className="text-emerald-400 font-semibold">Active & Verified</span></p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setScannerOpen(true)}
              className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold text-xs h-10 gap-1.5 shadow-lg shadow-[#FF5722]/30"
            >
              <Scan className="w-4 h-4" /> Reception QR Scanner
            </Button>
            <Link href="/owner/listing/edit/g1111111-1111-1111-1111-111111111111">
              <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10 text-xs h-10 gap-1.5">
                <Edit className="w-4 h-4 text-[#FF5722]" /> Edit Gym Listing
              </Button>
            </Link>
            <Link href="/owner/deals">
              <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10 text-xs h-10 gap-1.5">
                <Tag className="w-4 h-4 text-[#FF5722]" /> Create Deal
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-[#161626] border-white/10 text-white">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Page Views (This Month)</p>
                <h3 className="text-3xl font-extrabold text-white font-syne mt-1">1,420</h3>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold mt-1">
                  <TrendingUp className="w-3 h-3" /> +18% from last month
                </span>
              </div>
              <div className="p-3 bg-[#FF5722]/10 text-[#FF5722] rounded-xl">
                <Eye className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#161626] border-white/10 text-white">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Trial Requests</p>
                <h3 className="text-3xl font-extrabold text-white font-syne mt-1">38</h3>
                <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">2 pending confirmation</span>
              </div>
              <div className="p-3 bg-[#FF5722]/10 text-[#FF5722] rounded-xl">
                <Ticket className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#161626] border-white/10 text-white">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">WhatsApp Clicks</p>
                <h3 className="text-3xl font-extrabold text-white font-syne mt-1">94</h3>
                <span className="text-[11px] text-gray-400 mt-1 block">Direct lead inquiries</span>
              </div>
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <MessageSquare className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#161626] border-white/10 text-white">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Active Plan</p>
                <h3 className="text-xl font-bold text-white font-syne mt-1">Free Listing</h3>
                <Link href="/owner/upgrade" className="text-xs text-[#FF5722] hover:underline font-semibold mt-1 block">
                  Upgrade to Premium →
                </Link>
              </div>
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[#161626] border-white/10 text-white">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold font-syne text-white flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-[#FF5722]" /> Recent Free Trial Requests
                </h3>
                <p className="text-xs text-gray-400 font-normal">Accept pending requests to issue Digital QR Workout Tickets</p>
              </div>

              <Link href="/owner/inquiries">
                <Button variant="ghost" className="text-xs text-[#FF5722] hover:text-[#FF5722]/90 flex items-center gap-1">
                  View All Requests <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {trials.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-base">{t.userName}</h4>
                      <span className="text-xs text-gray-400">{t.userPhone}</span>
                      <span className="font-mono text-[11px] text-[#FF5722] bg-[#FF5722]/10 px-2 py-0.5 rounded border border-[#FF5722]/30">
                        {t.passCode}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300">
                      Requested Visit Date:{' '}
                      <span className="text-white font-semibold">{t.visitDate}</span> ({t.slot})
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {t.status === 'pending' ? (
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleUpdateStatus(t.id, 'accepted')}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-9 px-4 font-semibold flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Accept & Issue QR Pass
                        </Button>
                        <Button
                          onClick={() => handleUpdateStatus(t.id, 'declined')}
                          variant="outline"
                          className="border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs h-9 px-4 font-semibold flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Decline
                        </Button>
                      </div>
                    ) : t.status === 'accepted' ? (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 gap-1 px-3 py-1 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Pass Accepted (QR Active)
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/40 gap-1 px-3 py-1 text-xs">
                        <XCircle className="w-3.5 h-3.5" /> Declined
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* QR Code Scanner Tool */}
      <QrScannerModal
        open={scannerOpen}
        onOpenChange={setScannerOpen}
        onCheckInSuccess={handleCheckInSuccess}
      />

      <Footer />
    </div>
  );
}

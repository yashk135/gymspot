'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, CheckCircle2, XCircle, ShieldCheck, ArrowLeft, Eye, MapPin, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface PendingGym {
  id: string;
  name: string;
  ownerName: string;
  ownerPhone: string;
  address: string;
  city: string;
  gymType: string;
  submittedAt: string;
  coverPhoto: string;
  description: string;
}

const SAMPLE_PENDING_GYMS: PendingGym[] = [
  {
    id: 'g-pending-1',
    name: 'Iron Forge Fitness Gym',
    ownerName: 'Rohan Mehta',
    ownerPhone: '+91 98989 12345',
    address: 'Link Road, Malad West',
    city: 'Mumbai',
    gymType: 'Powerlifting',
    submittedAt: '2 hours ago',
    coverPhoto: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80',
    description: 'New 8,000 sq.ft. powerlifting facility with competition squat racks and calibrated plates.',
  },
  {
    id: 'g-pending-2',
    name: 'Serenity Pilates & Wellness Studio',
    ownerName: 'Neha Kapoor',
    ownerPhone: '+91 97777 88888',
    address: 'Koregaon Park, Lane 7',
    city: 'Pune',
    gymType: 'Yoga',
    submittedAt: '5 hours ago',
    coverPhoto: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80',
    description: 'Boutique Pilates studio equipped with Merrithew Reformers and private training suites.',
  },
  {
    id: 'g-pending-3',
    name: 'Alpha Combat MMA Academy',
    ownerName: 'Kabir Khan',
    ownerPhone: '+91 96666 55555',
    address: 'Indiranagar 100ft Road',
    city: 'Bangalore',
    gymType: 'MMA',
    submittedAt: '1 day ago',
    coverPhoto: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1200&q=80',
    description: 'Full MMA facility with 24ft competition cage, BJJ mats, and Muay Thai heavy bags.',
  },
];

export default function VerificationsPage() {
  const [pendingGyms, setPendingGyms] = useState<PendingGym[]>(SAMPLE_PENDING_GYMS);
  const [selectedGym, setSelectedGym] = useState<PendingGym | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = (gym: PendingGym) => {
    setPendingGyms(pendingGyms.filter((g) => g.id !== gym.id));
    setSelectedGym(null);
    toast.success(`Approved "${gym.name}"! Set as verified gym and sent email to ${gym.ownerName}.`);
  };

  const handleReject = (gym: PendingGym) => {
    if (!rejectReason) {
      toast.error('Please enter a rejection reason for the owner');
      return;
    }
    setPendingGyms(pendingGyms.filter((g) => g.id !== gym.id));
    setSelectedGym(null);
    setRejectReason('');
    toast(`Rejected "${gym.name}". Notification sent with reason.`);
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-col selection:bg-[#FF5722] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 space-y-8">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-syne font-bold text-white flex items-center gap-2">
              <Clock className="w-6 h-6 text-[#FF5722]" /> Gym Verification Queue ({pendingGyms.length})
            </h1>
            <p className="text-sm text-gray-400">Review pending gym owner submissions before publishing live on GymSpot</p>
          </div>
        </div>

        {pendingGyms.length === 0 ? (
          <div className="p-12 text-center border border-white/10 rounded-2xl bg-[#161626] space-y-4">
            <div className="mx-auto p-4 bg-emerald-500/10 text-emerald-400 rounded-full w-fit">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-white">Verification Queue Clear!</h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              All submitted gym listings have been reviewed and processed.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingGyms.map((gym) => (
              <div
                key={gym.id}
                className="p-5 rounded-2xl bg-[#161626] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-[#FF5722]/40 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-20 rounded-xl overflow-hidden shrink-0 border border-white/10">
                    <Image src={gym.coverPhoto} alt={gym.name} fill className="object-cover" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-lg font-syne">{gym.name}</h3>
                      <Badge variant="outline" className="border-white/20 text-xs">{gym.gymType}</Badge>
                    </div>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#FF5722]" /> {gym.address}, {gym.city}
                    </p>
                    <p className="text-xs text-gray-400">
                      Owner: <span className="text-white font-medium">{gym.ownerName}</span> ({gym.ownerPhone}) · {gym.submittedAt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Dialog>
                    <DialogTrigger>
                      <Button
                        onClick={() => setSelectedGym(gym)}
                        variant="outline"
                        className="border-white/10 text-white text-xs h-10 px-4 hover:bg-white/5 flex items-center gap-1.5"
                      >
                        <Eye className="w-4 h-4 text-[#FF5722]" /> Inspect Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#161626] border-white/10 text-white sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold font-syne text-white">{gym.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-2 text-xs">
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden">
                          <Image src={gym.coverPhoto} alt={gym.name} fill className="object-cover" />
                        </div>
                        <p className="text-gray-300 leading-relaxed">{gym.description}</p>
                        <div className="p-3 rounded-lg bg-white/5 space-y-1 text-gray-300">
                          <p><strong>Owner Name:</strong> {gym.ownerName}</p>
                          <p><strong>Phone:</strong> {gym.ownerPhone}</p>
                          <p><strong>Location:</strong> {gym.address}, {gym.city}</p>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-white/10">
                          <Label className="text-xs text-gray-400">Rejection Reason (if rejecting)</Label>
                          <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="State reason for rejection..."
                            className="w-full rounded-md bg-white/5 border border-white/10 text-white text-xs p-2.5"
                          />
                        </div>

                        <div className="flex gap-3 pt-2">
                          <Button
                            onClick={() => handleReject(gym)}
                            variant="outline"
                            className="flex-1 border-red-500/40 text-red-400 hover:bg-red-500/10 font-bold h-10 text-xs"
                          >
                            <XCircle className="w-4 h-4 mr-1" /> Reject Listing
                          </Button>
                          <Button
                            onClick={() => handleApprove(gym)}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-10 text-xs"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" /> Approve & Verify
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    onClick={() => handleApprove(gym)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-10 px-4 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

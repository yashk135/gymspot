'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ticket, CheckCircle2, XCircle, Clock, ArrowLeft, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';

const ALL_INQUIRIES = [
  {
    id: 'tr-101',
    userName: 'Rahul Sharma',
    userPhone: '+91 98765 43210',
    userEmail: 'rahul@example.com',
    visitDate: '2026-08-09',
    slot: 'Morning (06:00 - 10:00)',
    status: 'pending',
    note: 'Looking for personal trainer recommendation.',
    createdAt: '2026-08-07 10:30 AM',
  },
  {
    id: 'tr-102',
    userName: 'Ananya Verma',
    userPhone: '+91 98123 45678',
    userEmail: 'ananya@example.com',
    visitDate: '2026-08-10',
    slot: 'Evening (17:00 - 21:00)',
    status: 'accepted',
    note: 'Interested in annual membership pricing details.',
    createdAt: '2026-08-07 08:15 AM',
  },
  {
    id: 'tr-103',
    userName: 'Amit Patel',
    userPhone: '+91 97654 32109',
    userEmail: 'amit@example.com',
    visitDate: '2026-08-11',
    slot: 'Afternoon (12:00 - 16:00)',
    status: 'pending',
    note: 'Wants to check steam room facilities.',
    createdAt: '2026-08-06 04:20 PM',
  },
];

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState(ALL_INQUIRIES);

  const handleUpdateStatus = (id: string, newStatus: 'accepted' | 'declined') => {
    setInquiries(inquiries.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq)));
    toast.success(`Request ${newStatus === 'accepted' ? 'Accepted' : 'Declined'}`);
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-col selection:bg-[#FF5722] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 space-y-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <Link href="/owner/dashboard">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-syne font-bold text-white flex items-center gap-2">
                <Ticket className="w-6 h-6 text-[#FF5722]" /> Manage Trial Requests & Inquiries
              </h1>
              <p className="text-sm text-gray-400">Review, accept, and respond to incoming trial pass requests</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/5 border border-white/10 p-1 rounded-xl">
            <TabsTrigger value="all" className="data-[state=active]:bg-[#FF5722] data-[state=active]:text-white text-xs">
              All ({inquiries.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-[#FF5722] data-[state=active]:text-white text-xs">
              Pending ({inquiries.filter((i) => i.status === 'pending').length})
            </TabsTrigger>
            <TabsTrigger value="accepted" className="data-[state=active]:bg-[#FF5722] data-[state=active]:text-white text-xs">
              Accepted ({inquiries.filter((i) => i.status === 'accepted').length})
            </TabsTrigger>
            <TabsTrigger value="declined" className="data-[state=active]:bg-[#FF5722] data-[state=active]:text-white text-xs">
              Declined ({inquiries.filter((i) => i.status === 'declined').length})
            </TabsTrigger>
          </TabsList>

          {['all', 'pending', 'accepted', 'declined'].map((tab) => {
            const filtered = inquiries.filter((inq) => (tab === 'all' ? true : inq.status === tab));

            return (
              <TabsContent key={tab} value={tab}>
                <Card className="bg-[#161626] border-white/10 text-white">
                  <CardContent className="p-6 space-y-4">
                    {filtered.length === 0 ? (
                      <div className="p-8 text-center text-gray-500 text-sm">
                        No trial requests found for this filter.
                      </div>
                    ) : (
                      filtered.map((inq) => (
                        <div
                          key={inq.id}
                          className="p-5 rounded-xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <h4 className="font-bold text-white text-base">{inq.userName}</h4>
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Phone className="w-3 h-3 text-[#FF5722]" /> {inq.userPhone}
                              </span>
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Mail className="w-3 h-3 text-[#FF5722]" /> {inq.userEmail}
                              </span>
                            </div>

                            <p className="text-xs text-gray-300">
                              Visit Date:{' '}
                              <span className="text-white font-semibold">{inq.visitDate}</span> ({inq.slot})
                            </p>

                            {inq.note && (
                              <p className="text-xs text-gray-400 italic bg-black/20 p-2 rounded-md">
                                &ldquo;{inq.note}&rdquo;
                              </p>
                            )}

                            <span className="text-[10px] text-gray-500 block">Requested on {inq.createdAt}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            {inq.status === 'pending' ? (
                              <div className="flex items-center gap-2">
                                <Button
                                  onClick={() => handleUpdateStatus(inq.id, 'accepted')}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-9 px-4 font-semibold flex items-center gap-1"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Accept Pass
                                </Button>
                                <Button
                                  onClick={() => handleUpdateStatus(inq.id, 'declined')}
                                  variant="outline"
                                  className="border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs h-9 px-4 font-semibold flex items-center gap-1"
                                >
                                  <XCircle className="w-3.5 h-3.5" /> Decline
                                </Button>
                              </div>
                            ) : inq.status === 'accepted' ? (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 gap-1 px-3 py-1 text-xs">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Accepted
                              </Badge>
                            ) : (
                              <Badge className="bg-red-500/20 text-red-400 border-red-500/40 gap-1 px-3 py-1 text-xs">
                                <XCircle className="w-3.5 h-3.5" /> Declined
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}

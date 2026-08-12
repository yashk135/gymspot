'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tag, Plus, Trash2, ArrowLeft, Zap, Sparkles, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface DealItem {
  id: string;
  title: string;
  description: string;
  discountPercent: number;
  expiryDate: string;
  isActive: boolean;
}

const SAMPLE_DEALS: DealItem[] = [
  {
    id: 'deal-1',
    title: 'Flat 30% OFF Annual VIP Membership',
    description: 'Exclusive discount on 12-month memberships for GymSpot users.',
    discountPercent: 30,
    expiryDate: '2026-08-31',
    isActive: true,
  },
  {
    id: 'deal-2',
    title: 'Free 3-Day All-Access Pass',
    description: 'Complimentary 3-day access to all weight room and sauna facilities.',
    discountPercent: 100,
    expiryDate: '2026-08-15',
    isActive: true,
  },
];

export default function DealsPage() {
  const [deals, setDeals] = useState<DealItem[]>(SAMPLE_DEALS);
  const [modalOpen, setModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(20);
  const [expiryDate, setExpiryDate] = useState('2026-08-31');

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error('Please enter deal title and description');
      return;
    }

    const newDeal: DealItem = {
      id: `deal-${Date.now()}`,
      title,
      description,
      discountPercent,
      expiryDate,
      isActive: true,
    };

    setDeals([newDeal, ...deals]);
    setTitle('');
    setDescription('');
    setModalOpen(false);
    toast.success('New deal banner created and published to live strip!');
  };

  const handleDeleteDeal = (id: string) => {
    setDeals(deals.filter((d) => d.id !== id));
    toast('Deal removed');
  };

  const toggleDealActive = (id: string) => {
    setDeals(deals.map((d) => (d.id === id ? { ...d, isActive: !d.isActive } : d)));
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-col selection:bg-[#FF5722] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <Link href="/owner/dashboard">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF5722]/10 text-[#FF5722] text-[10px] font-bold uppercase tracking-wider mb-1">
                <Zap className="w-3 h-3" /> Killer Feature #4
              </div>
              <h1 className="text-3xl font-syne font-bold text-white flex items-center gap-2">
                <Tag className="w-6 h-6 text-[#FF5722]" /> Create Deals & Discount Offers
              </h1>
              <p className="text-sm text-gray-400">Publish time-limited offers to rank on the home screen Live Deals strip</p>
            </div>
          </div>

          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger>
              <Button className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold h-11 px-6 text-xs flex items-center gap-2 shadow-lg shadow-[#FF5722]/30">
                <Plus className="w-4 h-4" /> Create New Deal
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#161626] border-white/10 text-white sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold font-syne text-white flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#FF5722]" /> Create Discount Deal Banner
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleCreateDeal} className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-300">Deal Title *</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Flat 30% OFF Annual Pass"
                    className="h-10 bg-white/5 border-white/10 text-white text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-gray-300">Description *</Label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Explain the offer details and conditions..."
                    className="w-full rounded-md bg-white/5 border border-white/10 text-white text-xs p-3 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-300">Discount (%) *</Label>
                    <Input
                      type="number"
                      min={5}
                      max={100}
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(Number(e.target.value))}
                      className="h-10 bg-white/5 border-white/10 text-white text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-gray-300">Expiry Date *</Label>
                    <Input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="h-10 bg-white/5 border-white/10 text-white text-xs"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-11 bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold text-xs mt-2">
                  Publish Deal Banner
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-r from-[#FF5722]/20 to-purple-500/20 border border-[#FF5722]/40 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FF5722]" /> Gyms with Active Deals Get 3x More Trial Requests!
            </h4>
            <p className="text-xs text-gray-300">Active deal banners are featured directly on the home screen Live Deals strip.</p>
          </div>
        </div>

        <Card className="bg-[#161626] border-white/10 text-white">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-bold font-syne text-white border-b border-white/10 pb-3">
              Your Published Deal Banners ({deals.length})
            </h3>

            <div className="space-y-3">
              {deals.map((deal) => (
                <div
                  key={deal.id}
                  className="p-5 rounded-xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 relative"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[#FF5722] text-white font-bold text-[10px]">
                        {deal.discountPercent}% OFF
                      </Badge>
                      <h4 className="font-bold text-white text-base font-syne">{deal.title}</h4>
                    </div>

                    <p className="text-xs text-gray-300">{deal.description}</p>
                    <span className="text-[11px] text-amber-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Expires: {deal.expiryDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleDealActive(deal.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        deal.isActive ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/10 text-gray-400'
                      }`}
                    >
                      {deal.isActive ? 'Active' : 'Paused'}
                    </button>

                    <button
                      onClick={() => handleDeleteDeal(deal.id)}
                      className="text-gray-400 hover:text-red-400 p-2 rounded-lg bg-white/5 hover:bg-white/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}

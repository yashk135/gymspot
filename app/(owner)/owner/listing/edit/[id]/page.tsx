'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, ArrowLeft, Save, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function ListingEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [name, setName] = useState("Golds Gym — Andheri West");
  const [tagline, setTagline] = useState("Mumbai flagship fitness centre & strength hub");
  const [description, setDescription] = useState(
    "Gold's Gym Andheri West is a world-class 15,000 sq.ft. fitness sanctuary featuring authentic Hammer Strength equipment, Olympic lifting platforms, a dedicated turf functional area, luxury steam & sauna rooms."
  );
  const [address, setAddress] = useState("Veera Desai Road, Near Fun Republic, Andheri West, Mumbai");
  const [phone, setPhone] = useState("+912226730001");
  const [email, setEmail] = useState("andheri@goldsgym.in");
  const [status, setStatus] = useState<'active' | 'closed'>('active');
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Gym listing updated successfully!");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-col selection:bg-[#FF5722] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 space-y-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <Link href="/owner/dashboard">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-syne font-bold text-white flex items-center gap-2">
                <Building2 className="w-6 h-6 text-[#FF5722]" /> Edit Gym Listing
              </h1>
              <p className="text-sm text-gray-400">Update listing details, pricing, timings, and operational status</p>
            </div>
          </div>

          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-xs gap-1 px-3 py-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Listing
          </Badge>
        </div>

        <Card className="bg-[#161626] border-white/10 text-white">
          <CardContent className="p-6 md:p-8 space-y-6">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">Gym Operational Status</h4>
                  <p className="text-xs text-gray-400">Toggle whether your gym is active or temporarily closed for maintenance</p>
                </div>

                <button
                  type="button"
                  onClick={() => setStatus(status === 'active' ? 'closed' : 'active')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    status === 'active'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-red-500/20 text-red-400 border border-red-500/40'
                  }`}
                >
                  {status === 'active' ? '● Listing Active' : '● Temporarily Closed'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-300">Gym Name *</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="h-11 bg-white/5 border-white/10 text-white text-xs" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-300">Tagline</Label>
                  <Input value={tagline} onChange={(e) => setTagline(e.target.value)} className="h-11 bg-white/5 border-white/10 text-white text-xs" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-gray-300">Full Description *</Label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full rounded-md bg-white/5 border border-white/10 text-white text-xs p-3 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-300">Street Address *</Label>
                  <Input value={address} onChange={(e) => setAddress(e.target.value)} className="h-11 bg-white/5 border-white/10 text-white text-xs" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-300">Phone *</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11 bg-white/5 border-white/10 text-white text-xs" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-300">Email *</Label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 bg-white/5 border-white/10 text-white text-xs" />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/10">
                <Button type="submit" disabled={saving} className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold h-11 px-8 text-xs flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Listing Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}

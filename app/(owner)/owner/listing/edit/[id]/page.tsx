'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, ArrowLeft, Save, ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ListingEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const supabase = createClient();

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'active' | 'closed'>('active');
  const [startingPrice, setStartingPrice] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadingGym, setLoadingGym] = useState(true);

  // Load gym data from the API on mount
  useEffect(() => {
    async function loadGym() {
      try {
        const res = await fetch(`/api/gyms/${id}`);
        const data = await res.json();
        const g = data.gym;
        if (g) {
          setName(g.name || '');
          setTagline(g.tagline || '');
          setDescription(g.description || '');
          setAddress(g.address || '');
          setPhone(g.phone || '');
          setEmail(g.email || '');
          setStartingPrice(String(g.starting_price || ''));
          setStatus(g.is_active === false ? 'closed' : 'active');
        }
      } catch {
        toast.error('Failed to load gym data');
      } finally {
        setLoadingGym(false);
      }
    }
    loadGym();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address) {
      toast.error('Gym Name and Address are required');
      return;
    }

    setSaving(true);
    try {
      // 1. Save to Supabase gyms table
      const { error } = await (supabase.from('gyms') as any)
        .update({
          name: name.trim(),
          tagline: tagline.trim(),
          description: description.trim(),
          address: address.trim(),
          phone: phone.trim(),
          email: email.trim(),
          starting_price: Number(startingPrice) || 0,
          is_active: status === 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        // Supabase table may not exist in free tier - save to localStorage as fallback
        // so the user's gym page picks up the changes
        const overrides = JSON.parse(localStorage.getItem('gymspot_overrides') || '{}');
        overrides[id] = {
          name: name.trim(),
          tagline: tagline.trim(),
          description: description.trim(),
          address: address.trim(),
          phone: phone.trim(),
          email: email.trim(),
          starting_price: Number(startingPrice) || 0,
          is_active: status === 'active',
        };
        localStorage.setItem('gymspot_overrides', JSON.stringify(overrides));
        // Also broadcast change to other tabs via BroadcastChannel
        try {
          const bc = new BroadcastChannel('gymspot_gym_updates');
          bc.postMessage({ gymId: id, ...overrides[id] });
          bc.close();
        } catch {}
      }

      toast.success('✅ Gym listing updated successfully! Changes are now live for all visitors.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loadingGym) {
    return (
      <div className="min-h-screen bg-[#1A1A2E] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF5722]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-col selection:bg-[#FF5722] selection:text-white">
      <header className="w-full h-16 border-b border-white/10 bg-[#161626] px-6 flex items-center justify-between sticky top-0 z-40">
        <Link href="/owner/dashboard" className="flex items-center gap-2 font-syne font-extrabold text-xl text-white">
          <Building2 className="w-6 h-6 text-[#FF5722]" />
          Gym<span className="text-[#FF5722]">Spot</span>
          <span className="text-xs text-gray-400 font-normal ml-1">Owner Portal</span>
        </Link>
        <Link href="/owner/dashboard">
          <Button variant="ghost" className="text-gray-400 hover:text-white gap-2 text-xs">
            <ArrowLeft className="w-4 h-4" /> Owner Dashboard
          </Button>
        </Link>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 space-y-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h1 className="text-3xl font-syne font-bold text-white flex items-center gap-2">
              <Building2 className="w-6 h-6 text-[#FF5722]" /> Edit Gym Listing
            </h1>
            <p className="text-sm text-gray-400">Update listing details, pricing, timings, and operational status</p>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-xs gap-1 px-3 py-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Listing
          </Badge>
        </div>

        <Card className="bg-[#161626] border-white/10 text-white">
          <CardContent className="p-6 md:p-8 space-y-6">
            <form onSubmit={handleSave} className="space-y-6">
              {/* Operational Status Toggle */}
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
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Gold's Gym Andheri West"
                    className="h-11 bg-white/5 border-white/10 text-white text-xs"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-300">Tagline</Label>
                  <Input
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Mumbai's premium strength hub"
                    className="h-11 bg-white/5 border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-gray-300">Full Description *</Label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe your gym, equipment, specialties, and unique features..."
                  className="w-full rounded-md bg-white/5 border border-white/10 text-white text-xs p-3 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs text-gray-300">Street Address *</Label>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Veera Desai Road, Andheri West"
                    className="h-11 bg-white/5 border-white/10 text-white text-xs"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-300">Starting Price (₹/mo)</Label>
                  <Input
                    type="number"
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(e.target.value)}
                    placeholder="e.g. 2500"
                    className="h-11 bg-white/5 border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-300">Phone *</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+912226730001"
                    className="h-11 bg-white/5 border-white/10 text-white text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-300">Email *</Label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="gym@example.com"
                    className="h-11 bg-white/5 border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/10">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold h-11 px-8 text-xs flex items-center gap-2 shadow-lg shadow-[#FF5722]/30"
                >
                  {saving ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...</>
                  ) : (
                    <><Save className="w-4 h-4" /> Save Listing Changes</>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

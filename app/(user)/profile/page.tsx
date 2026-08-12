'use client';

import { useState } from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useLocationStore } from '@/hooks/useLocation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Ticket, Star, MapPin, Globe, CheckCircle2, Clock, XCircle, Save } from 'lucide-react';
import { toast } from 'sonner';

const SAMPLE_TRIALS = [
  {
    id: 'tr-1',
    gymName: 'Golds Gym — Andheri West',
    preferredDate: '2026-08-10',
    timeSlot: 'Morning (06:00 - 10:00)',
    status: 'accepted',
    note: 'Interested in personal training session.',
  },
  {
    id: 'tr-2',
    gymName: 'Cult Fit — Bandra West',
    preferredDate: '2026-08-12',
    timeSlot: 'Evening (17:00 - 21:00)',
    status: 'pending',
    note: 'Group boxing workout pass.',
  },
];

export default function UserProfilePage() {
  const { user } = useAuth();
  const { city, setCity } = useLocationStore();

  const [name, setName] = useState(user?.user_metadata?.name || 'Yash Karwa');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [email] = useState(user?.email || 'yash@example.com');
  const [currency, setCurrency] = useState('INR');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-col selection:bg-[#FF5722] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8 space-y-8">
        {/* Profile Header Card */}
        <div className="p-6 rounded-2xl bg-[#161626] border border-white/10 flex flex-col sm:flex-row items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-[#FF5722] text-white font-extrabold font-syne text-3xl flex items-center justify-center border-2 border-white/20 shadow-lg shadow-[#FF5722]/30 shrink-0">
            {name[0]?.toUpperCase() || 'U'}
          </div>
          <div className="space-y-1 text-center sm:text-left flex-1">
            <h1 className="text-2xl font-bold font-syne text-white">{name}</h1>
            <p className="text-xs text-gray-400">{email} · {phone}</p>
            <div className="flex items-center gap-2 justify-center sm:justify-start pt-1">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-[10px]">
                Active Member
              </Badge>
              <Badge variant="outline" className="border-white/20 text-gray-300 text-[10px]">
                📍 {city}
              </Badge>
            </div>
          </div>
        </div>

        {/* Profile Tabs: Account Details / My Trial Passes / My Reviews */}
        <Tabs defaultValue="trials" className="w-full space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10 p-1 rounded-xl">
            <TabsTrigger value="trials" className="data-[state=active]:bg-[#FF5722] data-[state=active]:text-white text-xs gap-1.5 py-2.5">
              <Ticket className="w-4 h-4" /> My Free Trial Passes
            </TabsTrigger>
            <TabsTrigger value="account" className="data-[state=active]:bg-[#FF5722] data-[state=active]:text-white text-xs gap-1.5 py-2.5">
              <User className="w-4 h-4" /> Account Settings
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-[#FF5722] data-[state=active]:text-white text-xs gap-1.5 py-2.5">
              <Star className="w-4 h-4" /> My Reviews
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: My Trial Passes */}
          <TabsContent value="trials">
            <Card className="bg-[#161626] border-white/10 text-white">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold font-syne text-white border-b border-white/10 pb-3">
                  My Free Trial Requests
                </h3>

                <div className="space-y-3">
                  {SAMPLE_TRIALS.map((tr) => (
                    <div key={tr.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <h4 className="font-bold text-white text-base">{tr.gymName}</h4>
                        <p className="text-xs text-gray-400">
                          Visit Date: <span className="text-white font-medium">{tr.preferredDate}</span> ({tr.timeSlot})
                        </p>
                        {tr.note && <p className="text-xs text-gray-400 italic">&ldquo;{tr.note}&rdquo;</p>}
                      </div>

                      <div className="shrink-0">
                        {tr.status === 'accepted' ? (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 gap-1 px-3 py-1 text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Pass Accepted
                          </Badge>
                        ) : tr.status === 'pending' ? (
                          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40 gap-1 px-3 py-1 text-xs">
                            <Clock className="w-3.5 h-3.5" /> Pending Confirmation
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
          </TabsContent>

          {/* TAB 2: Account Settings */}
          <TabsContent value="account">
            <Card className="bg-[#161626] border-white/10 text-white">
              <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-bold font-syne text-white border-b border-white/10 pb-3">
                  Edit Personal Details
                </h3>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-300">Full Name</Label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-11 bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-300">Phone Number</Label>
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-11 bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-300">Email Address (Read Only)</Label>
                      <Input value={email} disabled className="h-11 bg-white/5 border-white/10 text-gray-500" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-gray-300 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#FF5722]" /> Preferred City
                      </Label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full h-11 rounded-md bg-white/5 border border-white/10 text-white text-xs px-3"
                      >
                        <option value="Mumbai">Mumbai</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="London">London</option>
                        <option value="Dubai">Dubai</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button type="submit" className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold h-11 px-6 text-xs flex items-center gap-2">
                      <Save className="w-4 h-4" /> Save Profile Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: My Reviews */}
          <TabsContent value="reviews">
            <Card className="bg-[#161626] border-white/10 text-white">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold font-syne text-white border-b border-white/10 pb-3">
                  My Posted Reviews
                </h3>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-white">Golds Gym — Andheri West</span>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>5.0 / 5</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">&ldquo;Clean equipment and great trainers! Steam room is amazing.&rdquo;</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
